'use strict';

const validate = require('cta-common').validate;
const BaseHelper = require('../../base/basehelper');
const Messenger = require('../messenger');
const ExecutionRequest = require('./httprequest/executions');

const EVENTS = require('./enum/events');
const CANCELPROGRESSES = require('./enum/cancelprogresses');

class ExecutionCancelation extends BaseHelper {
  constructor(cementHelper, logger) {
    super(cementHelper, logger);
    this.messenger = new Messenger(cementHelper, logger);
    this.executionRequest = new ExecutionRequest(cementHelper, logger);
  }
  _validate(context) {
    const job = context.data;
    return new Promise((resolve, reject) => {
      if (!validate(job.payload.execution.id, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'execution.id\' identifier in job payload'));
      }
      if (!validate(job.payload.execution.instances, { type: 'array' }).isValid) {
        reject(new Error('missing/incorrect \'execution.id\' identifier in job payload'));
      }
      resolve({ ok: 1 });
    });
  }
  _process(context) {
    context.emit(EVENTS.DONE, this.cementHelper.brickName);
    const execution = context.data.payload.execution;
    this.cancelExecution(context)
      .then((cancelProgresses) => {
        // TODO - change log level to debug
        this.logger.info(`Execution was canceled:${execution.id}`, cancelProgresses);
        return this.sendCancelStateToEds(execution.id, cancelProgresses);
      })
      .catch((err) => {
        this.logger.error(`Cannot cancel execution:${execution.id}`, err);
      });
  }

  cancelExecution(context) {
    const execution = context.data.payload.execution;
    const instances = context.data.payload.execution.instances;
    const promises = instances.map((instance) => {
      let p = Promise.resolve();
      if (instance.state === 'pending') {
        p = this.cancelExecutionPending(execution, instance);
      } else if (instance.state === 'running') {
        p = this.cancelExecutionRunning(execution, instance);
      } else {
        p = Promise.reject(new Error(`instance.state is not correct:${instance.state}`));
      }
      p.catch((err) => {
        this.logger.error(`Cannot cancel execution:${execution.id} for instance:${instance.hostname}`, err);
        return `fail: ${err.message}`;
      })
      return p;
    });
    return Promise.all(promises)
      .then((results) => {
        return this.getCancelStatusesResponse(instances, results);
      });
  }

  cancelExecutionPending(execution, instance) {
    const instanceQueue = this.getInstanceQueueName(instance);
    return this.removeMessageFromInstanceQueues(execution.id, instanceQueue)
      .then((removed) => {
        if (removed) {
          return CANCELPROGRESSES.MESSAGEREMOVED;
        } else {
          return this.sendCancelCommandToInstance(execution.id, instanceQueue)
            .then(() => {
              return CANCELPROGRESSES.CANCELSENT;
            });
        }
      });
  }

  cancelExecutionRunning(execution, instance) {
    const instanceQueue = this.getInstanceQueueName(instance);
    this.sendCancelCommandToInstance(execution.id, instanceQueue)
      .then(() => {
        return CANCELPROGRESSES.CANCELSENT;
      });
  }

  getCancelStatusesResponse(instances, results) {
    return instances.map((instance, index) => {
      return {
        hostname: instance.hostname,
        cancelProgress: results[index],
      };
    });
  }

  removeMessageFromInstanceQueues(executionId, instanceQueue) {
    const that = this;
    let removed = false;
    return this.messenger.getAllMessagesFromQueue(instanceQueue)
      .then((messages) => {
        const filterMessages = messages.filter((message) => {
          return message.payload.execution.id !== executionId;
        });
        removed = messages.length > filterMessages.length;
        return filterMessages;
      })
      .then((messages) => {
        return that.messenger.sendManyMessagesToOneQueue(messages, instanceQueue);
      })
      .then(() => {
        return removed;
      });
  }

  sendCancelCommandToInstance(executionId, instanceQueue) {
    this.logger.info('Send cancel command to instance:', instanceQueue);
    const cancelMessage = this.getCancelMessage(executionId);

    return this.messenger.sendOneMessageToOneQueue(cancelMessage, instanceQueue);
  }

  getInstanceQueueName(instance) {
    return `cta.${instance.hostname}`;
  }

  getCancelMessage(executionId) {
    return {
      nature: {
        type: 'execution',
        quality: 'cancel',
      },
      payload: {
        execution: {
          id: executionId,
        },
      },
    };
  }

  sendCancelStateToEds(executionId, cancelProgresses) {
    // TODO - change log level to debug
    this.logger.info('Send canceled state for execution:', executionId);
    const promises = cancelProgresses.map((instance) => {
      if (instance.cancelProgress === CANCELPROGRESSES.MESSAGEREMOVED) {
        return this.executionRequest.createState({
          executionId,
          timestamp: new Date().getTime(),
          status: 'canceled',
          index: 0,
          hostname: instance.hostname,
        }).catch((err) => {
          this.logger.error(`Cannot send canceled state to EDS for execution:${executionId} hostname:${instance.hostname}`, err);
        });
      }
      return Promise.resolve();
    });

    return Promise.all(promises);
  }

}

module.exports = ExecutionCancelation;
