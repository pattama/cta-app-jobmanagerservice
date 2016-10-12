'use strict';

const validate = require('cta-common').validate;
const executionRest = require('./httprequest/executions');
const instancesRest = require('./httprequest/instances');
const BaseHelper = require('../../base/basehelper');
const Messenger = require('../messenger');

const EVENTS = require('./enum/events');
const RUNMODES = require('./enum/runmodes');

const _ = require('lodash');


class JobManagerCreation extends BaseHelper {
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

    this.acknowledgeMessage(context)
      .then(() => {
        return that.setupExecution(context);
      })
      .then((_execution) => {
        execution = _execution;
        return that.sendCommandToInstances(context, execution);
      })
      .then(() => {
        context.emit(EVENTS.DONE, that.cementHelper.brickName, execution);
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
    const instancePromise = this.getMatchingInstance(context);

    return Promise.all([createExecutionPromise, instancePromise])
      .then((results) => {
        const execution = results[0];
        const instances = results[1];
        return executionRest.updateExecution(execution.id, { instances });
      })
      .catch((restErr) => {
        that.logger.error(`Cannot setup an execution: ${restErr.statusCode}`);
        throw {
          returnCode: EVENTS.ERROR,
          brickName: that.cementHelper.brickName,
          response: new Error(`Cannot setup an execution: ${restErr.statusCode}`)
        }
      });
  }

  createExecution(context) {
    return executionRest.createExecution({
      scenarioId: context.data.payload.scenario.id,
      userId: context.data.payload.user.id,
    });
  }

  getMatchingInstance(context) {
    const that = this;
    const configuration = context.data.payload.configuration;
    return instancesRest.getMatchingInstances({
      runMode: configuration.runMode,
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

  sendCommandToInstances(context, execution) {
    const that = this;
    const testSuite = context.data.payload.scenario.testSuite;
    const configuration = context.data.payload.configuration;
    return that.sendMessagesToQueues(execution, testSuite, configuration.runMode)
      .catch((err) => {
        that.logger.error(`Cannot send command to instances ${err.returnCode}: `, err);
        throw err;
      });
  }

  sendMessagesToQueues(execution, testSuite, runMode) {
    const instanceQueues = this.getInstanceQueueName(execution.instances);
    const sharedQueue = this.getSharedQueueName(execution);

    const runMessage = this.getRunMessage(execution, testSuite);
    const runMessageParallel = this.getRunMessageForParallel(execution, testSuite);
    const readMessage = this.getReadMessage(execution, sharedQueue);

    if(runMode === RUNMODES.MONO) {
      return this.messenger.sendOneMessageToOneQueue(runMessage, instanceQueues[0]);

    } else if(runMode === RUNMODES.STRESS) {
      return this.messenger.sendOneMessageToManyQueues(runMessage, instanceQueues);

    } else if(runMode === RUNMODES.GROUP) {
      return this.messenger.sendOneMessageToOneQueue(runMessage, sharedQueue)
        .then(() => {
          return this.messenger.sendOneMessageToManyQueues(readMessage, instanceQueues);
        });

    } else if(runMode === RUNMODES.PARALLEL) {
      return this.messenger.sendManyMessagesToOneQueue(runMessageParallel, sharedQueue)
        .then(() => {
          this.messenger.sendOneMessageToManyQueues(readMessage, instanceQueues);
        });

    } else {
      throw {
        returnCode: EVENTS.ERROR,
        brickName: this.cementHelper.brickName,
        response: new Error(`runMode is not correct: ${runMode}`)
      }
    }
  }

  getSharedQueueName(execution) {
    return 'cta.' + execution.id;
  }

  getInstanceQueueName(instances) {
    return instances.map((instance) => 'cta.' + instance.hostname);
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
        testSuite: testSuite
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

module.exports = JobManagerCreation;
