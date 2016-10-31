'use strict';

const validate = require('cta-common').validate;
const executionRest = require('./httprequest/executions.js');
const instancesRest = require('./httprequest/instances');
const BaseHelper = require('../../base/basehelper');
const Messenger = require('../messenger');

const EVENTS = require('./enum/events');
const RUNMODES = require('./enum/runmodes');

const _ = require('lodash');


class JobManagerRun extends BaseHelper {
  constructor(cementHelper, logger) {
    super(cementHelper, logger);
    this.messenger = new Messenger(cementHelper, logger);
  }

  _validate(context) {
    const job = context.data;
    return new Promise((resolve, reject) => {
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

  _process(context) {
    const that = this;
    let execution;

    return this.acknowledgeMessage(context)
      .then(() => {
        return that.setupExecution(context);
      })
      .then((_execution) => {
        execution = _execution;
        return that.sendCommandToInstances(context, execution);
      })
      .then(() => {
        context.emit(EVENTS.DONE, that.cementHelper.brickName, execution);
      })
      .catch((err) => {
        context.emit(err.returnCode, err.brickName, err.response);
      });
  }

  acknowledgeMessage(context) {
    const that = this;
    return this.messenger.acknowledgeMessage(context.data.id)
      .catch((err) => {
        that.logger.error(`Cannot acknowledge message: ${context.data.id}`);
        throw err;
      });
  }

  setupExecution(context) {
    const that = this;
    const createExecutionPromise = this.createExecution(context);
    const instancePromise = this.getMatchingInstances(context);

    return Promise.all([createExecutionPromise, instancePromise])
      .then((results) => {
        const execution = results[0];
        const instances = results[1];
        const scenario = context.data.payload.scenario;
        const testsCount = scenario.testSuite.tests.length;
        const commandsCount = that.getCommandsCount(execution.runMode, instances.length, testsCount);
        return that.updateExecution(execution.id, { instances, commandsCount });
      })
      .then((execution) => {
        that.logger.info(`Execution was setup: ${execution.id}`)
        return execution;
      })
      .catch((restErr) => {
        that.logger.error(`Cannot setup an execution: ${restErr.error||''} ${restErr.statusCode||''}`);
        throw {
          returnCode: EVENTS.ERROR,
          brickName: that.cementHelper.brickName,
          response: new Error(`Cannot setup an execution: ${restErr.error||''} ${restErr.statusCode||''}`)
        }
      });
  }

  createExecution(context) {
    return executionRest.createExecution({
      scenarioId: context.data.payload.scenario.id,
      userId: context.data.payload.user.id,
      pendingTimeout: context.data.payload.scenario.pendingTimeout,
      runningTimeout: context.data.payload.scenario.runningTimeout
    });
  }

  updateExecution(executionId, execution) {
    return executionRest.updateExecution(
      executionId, execution
    );
  }

  getMatchingInstances(context) {
    const that = this;
    const configuration = context.data.payload.configuration;
    return instancesRest.getMatchingInstances({
      // runMode: configuration.runMode,
      properties: configuration.properties,
    }).then((instances) => {
      if(instances.length === 0) {
        that.logger.error(`No matching instances for configuration: ${configuration.id}`);
        throw {
          statusCode: `No Matching instances for configuration: ${configuration.id}`
        };
      }
      if(configuration.runMode === RUNMODES.MONO) {
        instances = instances.slice(0, 1);
      }
      return instances;
    });

  }

  getCommandsCount(runMode, instancesCount, testsCount) {
    if(runMode === RUNMODES.MONO) {
      return 1;
    } else if(runMode === RUNMODES.STRESS) {
      return instancesCount;
    } else if(runMode === RUNMODES.GROUP) {
      return 1;
    } else if(runMode === RUNMODES.PARALLEL) {
      return testsCount;
    }
  }

  sendCommandToInstances(context, execution) {
    const scenario = context.data.payload.scenario;
    const configuration = context.data.payload.configuration;
    const hostNames = execution.instances.map((instance) => instance.hostName);
    this.logger.info(`Sending execution:${execution.id} to ${hostNames} in ${configuration.runMode} mode`)

    let promise;
    if(configuration.runMode === RUNMODES.MONO || configuration.runMode === RUNMODES.STRESS) {
      promise = this.sendDirectCommandToInstances(scenario, configuration, execution);
    } else if(configuration.runMode === RUNMODES.GROUP || configuration.runMode === RUNMODES.PARALLEL) {
      promise = this.sendSharedCommandToInstances(scenario, configuration, execution);
    } else {
      throw {
        returnCode: EVENTS.ERROR,
        brickName: this.cementHelper.brickName,
        response: new Error(`runMode is not correct: ${runMode}`)
      }
    }

    return promise.catch((err) => {
        this.logger.error(`Cannot send command to instances ${err.returnCode}: `, err);
        throw err;
      });

  }

  sendDirectCommandToInstances(scenario, configuration, execution) {
    const testSuite = scenario.testSuite;
    const instanceQueues = this.getInstanceQueueName(execution.instances);
    const runMessage = this.getRunMessage(execution, testSuite);

    if(configuration.runMode === RUNMODES.MONO) {
      return this.messenger.sendOneMessageToOneQueue(runMessage, instanceQueues[0])

    } else if(configuration.runMode === RUNMODES.STRESS) {
      return this.messenger.sendOneMessageToManyQueues(runMessage, instanceQueues);

    }
  }

  sendSharedCommandToInstances(scenario, configuration, execution) {
    const testSuite = scenario.testSuite;
    const instanceQueues = this.getInstanceQueueName(execution.instances);
    const sharedQueue = this.getSharedQueueName(execution.id);
    const runMessage = this.getRunMessage(execution, testSuite);
    const runMessageParallel = this.getRunMessageForParallel(execution, testSuite);
    const readMessage = this.getReadMessage(execution, sharedQueue);
    const expires = execution.pendingTimeout || 12 * 60 * 60 * 1000; // TODO - how long should it be?
    const options = {
      autoDelete: true,
      expires: expires + 3000 // addition delay before destroy the queue
    };

    if(configuration.runMode === RUNMODES.GROUP) {
      return this.messenger.sendOneMessageToOneQueue(runMessage, sharedQueue, options)
        .then(() => {
          return this.messenger.sendOneMessageToManyQueues(readMessage, instanceQueues);
        });

    } else if(configuration.runMode === RUNMODES.PARALLEL) {
      return this.messenger.sendManyMessagesToOneQueue(runMessageParallel, sharedQueue, options)
        .then(() => {
          this.messenger.sendOneMessageToManyQueues(readMessage, instanceQueues);
        });

    }
  }

  getSharedQueueName(executionId) {
    return 'cta.' + executionId;
  }

  getInstanceQueueName(instances) {
    return instances.map((instance) => 'cta.' + instance.hostName);
  }

  getReadMessage(execution, sharedQueue) {
    return {
      nature: {
        type: 'execution',
        quality: 'read'
      },
      payload: {
        execution: {
          id: execution.id
        },
        queue: sharedQueue
      }
    }
  }

  getRunMessage(execution, testSuite) {
    return {
      nature: {
        type: 'execution',
        quality: 'run'
      },
      payload: {
        execution: {
          id: execution.id,
          startTimestamp: execution.startTimestamp,
          pendingTimeout: execution.pendingTimeout,
          runningTimeout: execution.runningTimeout
        },
        testSuite: testSuite,
      }
    }
  }

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
