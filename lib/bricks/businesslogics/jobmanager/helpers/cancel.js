'use strict';

const validate = require('cta-common').validate;
const BaseHelper = require('../../base/basehelper');
const Messenger = require('../messenger');
const executionRest = require('./httprequest/executions');

const EVENTS = require('./enum/events');
const RUNMODES = require('./enum/runmodes');

class JobManagerCancelation extends BaseHelper {
  constructor(cementHelper, logger) {
    super(cementHelper, logger);
    this.messenger = new Messenger(cementHelper, logger);
  }
  _validate(context) {
    const job = context.data;
    return new Promise((resolve, reject) => {
      if (!validate(job.payload.execution.id, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'execution.id\' identifier in job payload'));
      }
      resolve({ ok: 1 });
    });
  }
  _process(context) {
    const that = this;
    let execution, cancelStatuses;
    this.acknowledgeMessage(context)
      .then(() => {
        return that.getExecutionObject(context);
      })
      .then((_execution) => {
        execution = _execution;
        return that.cancelExecution(execution);
      })
      .then((_cancelStatuses) => {
        cancelStatuses = _cancelStatuses;
        if(execution.runMode === RUNMODES.GROUP ||
          execution.runMode === RUNMODES.PARALLEL) {
          return that.removeMessageFromSharedQueue(execution);
        }
      })
      .then(() => {
        return that.updateExecutionState(execution);
      })
      .then(() => {
        const response = {
          cancelStatuses: cancelStatuses
        }
        context.emit(EVENTS.DONE, that.cementHelper.brickName, response);
      })
      .catch((err) => {
        context.emit(err.returnCode, err.brickName, err.response);
      });
  }

  acknowledgeMessage(context) {
    const that = this;
    if(context.data.id) { // if context is from cta-io
      return this.messenger.acknowledgeMessage(context.data.id)
        .catch((err) => {
          that.logger.error(`Cannot acknowledge message: ${context.data.id}`);
          throw err;
        });
    } else { // if context is from restapi
      return Promise.resolve();
    }
  }

  getExecutionObject(context) {
    const that = this;
    const executionId = context.data.payload.execution.id;
    return executionRest.getExecution(executionId)
      .catch((restErr) => {
        that.logger.error(`Cannot get an execution object: ${restErr.statusCode}`);
        throw {
          returnCode: EVENTS.ERROR,
          brickName: that.cementHelper.brickName,
          response: `Cannot get an execution object: ${restErr.statusCode}`
        }
      })
  }

  cancelExecution(execution) {
    const that = this;
    const instanceQueues = this.getInstanceQueueName(execution.instances);
    const promises = instanceQueues.map((instanceQueue) => {
      return that.removeMessageFromInstanceQueues(execution.id, instanceQueue)
        .then((removed) => {
          if(removed) {
            return that.updateState(execution, instance , 'Cancel');
          } else {
            return that.sendCancelCommandToInstance(execution, instanceQueue)
          }
        });

    });
    return Promise.all(promises)
      .catch((err) => {
        that.logger.error(`Cannot cancel execution: ${execution.id}`);
        throw err;
      })
  }

  cancelExecution(execution) {
    const that = this;
    const instanceQueues = this.getInstanceQueueName(execution.instances);
    const promises = instanceQueues.map((instanceQueue) => {
      return that.removeMessageFromInstanceQueues(execution.id, instanceQueue)
        .then((removed) => {
          if(!removed) {
            return that.sendCancelCommandToInstance(execution, instanceQueue)
              .then(() => removed);
          }
          return removed;
        });

    });
    return Promise.all(promises)
      .then((removedArray) => {
        return that.getCancelStatuses(execution, removedArray);
      })
      .catch((err) => {
        that.logger.error(`Cannot cancel execution: ${execution.id}`);
        throw err;
      })
  }

  getCancelStatuses(execution, removedArray) {
    return execution.instances.map((instance, index) => {
      return {
        hostName: instance.hostName,
        cancelStatus: removedArray[index] ? 'CANCELLED' : 'IN_PROGRESS'
      }
    });
  }

  removeMessageFromInstanceQueues(executionId, instanceQueue) {
    const that = this;
    let removed = false;
    return this.messenger.getAllMessagesFromQueue(instanceQueue)
      .then((messages) => {
        const filterMessages = messages.filter((message) => message.payload.execution.id !== executionId);
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

  removeMessageFromSharedQueue(execution) {
    const that = this;
    const sharedQueue = this.getSharedQueueName(execution);
    return this.messenger.getAllMessagesFromQueue(sharedQueue)
      .catch((err) => {
        that.logger.error(`Cannot remove message from sharedQueue: ${sharedQueue}`)
        throw err;
      });
  }

  updateExecutionState(execution) {
    this.logger.info('Cancel execution:', execution.id);
    const that = this;
    return executionRest.updateExecution(execution.id, { state: 'Cancelled' })
      .catch((err) => {
        that.logger.error(`Cannot update execution state: ${err.statusCode}`);
        throw {
          returnCode: EVENTS.ERROR,
          brickName: that.cementHelper.brickName,
          response: `Cannot update execution state: ${err.statusCode}`
        }
      });
  }

  sendCancelCommandToInstance(execution, instanceQueue) {
    this.logger.info('Send stop command to instance:', instanceQueue);
    const cancelMessage = this.getCancelMessage(execution.id);

    return this.messenger.sendOneMessageToOneQueue(cancelMessage, instanceQueue);
  }

  getSharedQueueName(execution) {
    return 'cta.' + execution.id;
  }

  getInstanceQueueName(instances) {
    return instances.map((instance) => 'cta.' + instance.hostname);
  }

  getCancelMessage(executionId) {
    return {
      nature: {
        type: 'execution',
        quality: 'cancel'
      },
      payload: {
        execution: {
          id: executionId,
        }
      }
    }
  }

}

module.exports = JobManagerCancelation;
