'use strict';

const validate = require('cta-common').validate;
const ExecutionRequest = require('./httprequest/executions');
const InstanceRequest = require('./httprequest/instances');
const BaseHelper = require('../../base/basehelper');
const Messenger = require('../messenger');

const EVENTS = require('./enum/events');
const RUNMODES = require('./enum/runmodes');

const _ = require('lodash');

/**
 * Business Logic Execution Helper Run class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class JobManagerRun extends BaseHelper {
  constructor(cementHelper, logger) {
    super(cementHelper, logger);
    this.messenger = new Messenger(cementHelper, logger);
    this.executionRequest = new ExecutionRequest(cementHelper, logger);
    this.instanceRequest = new InstanceRequest(cementHelper, logger);
  }

  /**
   * Validates Context properties specific to this Helper
   *
   * @param {Context} context - a Context
   * @returns {Promise}
   */
  _validate(context) {
    const job = context.data;
    return new Promise((resolve, reject) => {
      if (!validate(job.payload.requestTimestamp, { type: 'number' }).isValid) {
        reject(new Error('missing/incorrect \'requestTimestamp\' number in job payload'));
      }
      if (!validate(job.payload.scenario, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'scenario\' object in job payload'));
      }
      if (!validate(job.payload.configuration, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'configuration\' object in job payload'));
      }
      if (!validate(job.payload.user, { type: 'object' }).isValid) {
        reject(new Error('missing/incorrect \'user\' object in job payload'));
      }
      resolve({ ok: 1 });
    });
  }

  /**
   * Process the context
   *
   * @param {Context} context - a Context
   */
  _process(context) {
    const that = this;
    let execution;
    let instances;

    return this.acknowledgeMessage(context)
      .then(() =>
        this.createExecution(context)
      )
      .then((_execution) => {
        execution = _execution;
        return this.getMatchingInstances(context);
      })
      .then((_instances) => {
        instances = _instances;
        return this.updateExecution(context, execution, instances);
      })
      .then((_updatedExecution) => {
        execution = _updatedExecution;
        return that.sendCommandToInstances(context, execution);
      })
      .then(() => {
        context.emit(EVENTS.DONE, that.cementHelper.brickName, execution);
      })
      .catch((err) => {
        if (err instanceof Error) {
          if (err.message === 'No matching instances found') {
            this.sendErrorToEds(execution.id, err.message);
          }
          context.emit(EVENTS.ERROR, that.cementHelper.brickName, err);
        } else {
          context.emit(err.returnCode, err.brickName, err.response);
        }
      });
  }

  /**
   * Acknowledge message
   * @private
   * @param {Context} context
   * @param {string} context.data.id - message id
   * @returns {Promise}
   */
  acknowledgeMessage(context) {
    const that = this;
    return this.messenger.acknowledgeMessage(context.data.id)
      .catch((err) => {
        that.logger.error(`Cannot acknowledge message: ${context.data.id}`);
        throw err;
      });
  }

  /**
   * Create execution. Send request to Execution Data Service
   * @private
   * @param {Context} context
   * @returns {Promise}
   */
  createExecution(context) {
    return this.executionRequest.createExecution({
      scenarioId: context.data.payload.scenario.id,
      userId: context.data.payload.user.id,
      requestTimestamp: context.data.payload.requestTimestamp,
      pendingTimeout: context.data.payload.scenario.pendingTimeout,
      runningTimeout: context.data.payload.scenario.runningTimeout,
    }).then((execution) => {
      this.logger.info(`Execution was created: ${execution.id}`);
      return execution;
    });
  }

  /**
   * Update execution. Send request to Execution Data Service
   * @private
   * @param {Context} context
   * @param {Execution} execution
   * @param {Array.<Instance>} instances - array of instances
   * @returns {Promise}
   */
  updateExecution(context, execution, instances) {
    const configuration = context.data.payload.configuration;
    const scenario = context.data.payload.scenario;
    const testsCount = scenario.testSuite.tests.length;
    const commandsCount = this.getCommandsCount(configuration.runMode,
      instances.length, testsCount);
    return this.executionRequest.updateExecution(
      execution.id, { instances, commandsCount }
    );
  }

  /**
   * Get matching instances. Send request to Instance Data Service
   * @private
   * @param {Context} context
   * @returns {Promise.<Array.<Instance>>}
   */
  getMatchingInstances(context) {
    const that = this;
    const configuration = context.data.payload.configuration;
    return this.instanceRequest.getMatchingInstances({
      // runMode: configuration.runMode,
      properties: configuration.properties,
    }).then((instances) => {
      if (instances.length === 0) {
        that.logger.error(`No matching instances found for configuration: ${configuration.id}`);
        throw new Error('No matching instances found');
      }
      if (configuration.runMode === RUNMODES.MONO) {
        return instances.slice(0, 1);
      }
      return instances;
    });
  }

  /**
   * Get commands count
   * @private
   * @param {RUNMODES} runMode
   * @param {number} instancesCount
   * @param {number} testsCount
   * @returns {number} commandsCount
   */
  getCommandsCount(runMode, instancesCount, testsCount) {
    if (runMode === RUNMODES.MONO) {
      return 1;
    } else if (runMode === RUNMODES.STRESS) {
      return instancesCount;
    } else if (runMode === RUNMODES.GROUP) {
      return 1;
    } else if (runMode === RUNMODES.PARALLEL) {
      return testsCount;
    }
    throw new Error(`runMode is not correct: ${runMode}`);
  }

  /**
   * Send an error to Execution Data Service
   * @private
   * @param {string} executionId
   * @param {string} errorMessage
   * @returns {Promise}
   */
  sendErrorToEds(executionId, errorMessage) {
    return this.executionRequest.createResult({
      executionId,
      testId: errorMessage,
      timestamp: new Date().getTime(),
      status: 'failed',
      index: 1,
    }).then(() =>
      this.executionRequest.createState({
        executionId,
        timestamp: new Date().getTime(),
        status: 'finished',
        index: 1,
      })
    ).catch((err) => {
      this.logger.error(`Cannot send error to EDS ${err}`);
    });
  }

  /**
   * Send command to instances
   * @private
   * @param {Context} context
   * @param {Execution} execution
   * @returns {Promise}
   */
  sendCommandToInstances(context, execution) {
    const scenario = context.data.payload.scenario;
    const configuration = context.data.payload.configuration;
    const hostnames = execution.instances.map((instance) => instance.hostname);
    this.logger.info(`Sending execution:${execution.id} to ${hostnames}` +
      ` in ${configuration.runMode} mode`);

    let promise;
    if (configuration.runMode === RUNMODES.MONO || configuration.runMode === RUNMODES.STRESS) {
      promise = this.sendDirectCommandToInstances(scenario, configuration, execution);
    } else if (configuration.runMode === RUNMODES.GROUP ||
        configuration.runMode === RUNMODES.PARALLEL) {
      promise = this.sendSharedCommandToInstances(scenario, configuration, execution);
    } else {
      throw new Error(`runMode is not correct: ${configuration.runMode}`);
    }

    return promise.catch((err) => {
      this.logger.error(`Cannot send command to instances ${err.returnCode}: ${err}`);
      throw err;
    });
  }

  /**
   * Send command to instances in direct mode
   * @private
   * @param {Scenario} scenario
   * @param {Configuration} configuration
   * @param {Execution} execution
   * @returns {Promise}
   */
  sendDirectCommandToInstances(scenario, configuration, execution) {
    const testSuite = scenario.testSuite;
    const instanceQueues = this.getInstanceQueueName(execution.instances);
    const runMessage = this.getRunMessage(execution, testSuite);

    if (configuration.runMode === RUNMODES.MONO) {
      return this.messenger.sendOneMessageToOneQueue(runMessage, instanceQueues[0]);
    } else if (configuration.runMode === RUNMODES.STRESS) {
      return this.messenger.sendOneMessageToManyQueues(runMessage, instanceQueues);
    }
    throw new Error(`runMode is not correct for direct command: ${configuration.runMode}`);
  }

  /**
   * Send command to instances in shared mode
   * @private
   * @param {Scenario} scenario
   * @param {Configuration} configuration
   * @param {Execution} execution
   * @returns {Promise}
   */
  sendSharedCommandToInstances(scenario, configuration, execution) {
    const testSuite = scenario.testSuite;
    const instanceQueues = this.getInstanceQueueName(execution.instances);
    const sharedQueue = this.getSharedQueueName(execution.id);
    const runMessage = this.getRunMessage(execution, testSuite);
    const runMessageParallel = this.getRunMessageForParallel(execution, testSuite);
    const readMessage = this.getReadMessage(execution, sharedQueue);
    // TODO - how long should it be?
    const expires = execution.pendingTimeout || 12 * 60 * 60 * 1000;
    const options = {
      autoDelete: true,
      expires: expires + 3000, // addition delay before destroy the queue
    };

    if (configuration.runMode === RUNMODES.GROUP) {
      return this.messenger.sendOneMessageToOneQueue(runMessage, sharedQueue, options)
        .then(() =>
          this.messenger.sendOneMessageToManyQueues(readMessage, instanceQueues)
        );
    } else if (configuration.runMode === RUNMODES.PARALLEL) {
      return this.messenger.sendManyMessagesToOneQueue(runMessageParallel, sharedQueue, options)
        .then(() =>
          this.messenger.sendOneMessageToManyQueues(readMessage, instanceQueues)
        );
    }
    throw new Error(`runMode is not correct for shared command: ${configuration.runMode}`);
  }

  /**
   * Get shared queue name
   * @private
   * @param {string} executionId
   * @returns {string} - queue name
   */
  getSharedQueueName(executionId) {
    return `cta.${executionId}`;
  }

  /**
   * Get instance queue name
   * @private
   * @param {Array.<Instannce>} instances
   * @returns {Array.<string>} - queue name
   */
  getInstanceQueueName(instances) {
    return instances.map((instance) => `cta.${instance.hostname}`);
  }

  /**
   * Get read message
   * @private
   * @param {Execution} execution
   * @param {string} sharedQueue
   * @returns {CtaJob}
   */
  getReadMessage(execution, sharedQueue) {
    return {
      nature: {
        type: 'execution',
        quality: 'read',
      },
      payload: {
        execution: {
          id: execution.id,
          requestTimestamp: execution.requestTimestamp,
          pendingTimeout: execution.pendingTimeout,
          runningTimeout: execution.runningTimeout,
        },
        queue: sharedQueue,
      },
    };
  }

  /**
   * Get run message
   * @private
   * @param {Execution} execution
   * @param {TestSuite} testSuite
   * @returns {CtaJob}
   */
  getRunMessage(execution, testSuite) {
    return {
      nature: {
        type: 'execution',
        quality: 'run',
      },
      payload: {
        execution: {
          id: execution.id,
          requestTimestamp: execution.requestTimestamp,
          pendingTimeout: execution.pendingTimeout,
          runningTimeout: execution.runningTimeout,
        },
        testSuite,
      },
    };
  }


  /**
   * Get run message for parallel mode
   * @private
   * @param {Execution} execution
   * @param {TestSuite} testSuite
   * @returns {CtaJob}
   */
  getRunMessageForParallel(execution, testSuite) {
    const that = this;
    return testSuite.tests.map((test) => {
      const ts = _.cloneDeep(testSuite);
      ts.tests = [test];
      return that.getRunMessage(execution, ts);
    });
  }
}

module.exports = JobManagerRun;
