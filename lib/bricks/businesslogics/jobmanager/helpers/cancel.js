'use strict';

const validate = require('cta-common').validate;
const BaseHelper = require('../../base/basehelper');
const Messenger = require('../messenger');
const ExecutionRequest = require('./httprequest/executions');

const EVENTS = require('./enum/events');
const CANCELPROGRESSES = require('./enum/cancelprogresses');

/**
 * Business Logic Execution Helper Cancel class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class ExecutionCancelation extends BaseHelper {
  constructor(cementHelper, logger) {
    super(cementHelper, logger);
    this.messenger = new Messenger(cementHelper, logger);
    this.executionRequest = new ExecutionRequest(cementHelper, logger);
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
      if (!validate(job.payload.execution.id, { type: 'identifier' }).isValid) {
        reject(new Error('missing/incorrect \'execution.id\' identifier in job payload'));
      }
      if (!validate(job.payload.execution.instances, { type: 'array' }).isValid) {
        reject(new Error('missing/incorrect \'execution.id\' identifier in job payload'));
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

  /**
   * Cancel execution
   * @private
   * @param {Context} context - a Context
   */
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
        this.logger.error(`Cannot cancel execution:${execution.id} for` +
          `instance:${instance.hostname}`, err);
        return `fail: ${err.message}`;
      });
      return p;
    });
    return Promise.all(promises)
      .then((results) =>
        this.getCancelStatusesResponse(instances, results)
      );
  }

  /**
   * Cancel execution if instance state is pending
   * @private
   * @param {Object} execution
   * @param {Object} instance
   */
  cancelExecutionPending(execution, instance) {
    const instanceQueue = this.getInstanceQueueName(instance);
    return this.removeMessageFromInstanceQueues(execution.id, instanceQueue)
      .then((removed) => {
        if (removed) {
          return CANCELPROGRESSES.MESSAGEREMOVED;
        }
        return this.sendCancelCommandToInstance(execution.id, instanceQueue)
          .then(() => CANCELPROGRESSES.CANCELSENT);
      });
  }


  /**
   * Cancel execution if instance state is running
   * @private
   * @param {Object} execution
   * @param {Object} instance
   */
  cancelExecutionRunning(execution, instance) {
    const instanceQueue = this.getInstanceQueueName(instance);
    this.sendCancelCommandToInstance(execution.id, instanceQueue)
      .then(() => CANCELPROGRESSES.CANCELSENT);
  }

  /**
   * create cancel progress
   * @private
   * @param {Array.<Instance>} instances
   * @param {Array.<string>} results
   */
  getCancelStatusesResponse(instances, results) {
    return instances.map((instance, index) => ({
      hostname: instance.hostname,
      cancelProgress: results[index],
    }));
  }

  /**
   * Remove messages which has executionId as same as given executionId
   * @private
   * @param {string} executionId
   * @param {string} instanceQueue - queue name
   * @returns {Promise.<Array.<boolean>>} - true, if at least 1 message was removed.
   */
  removeMessageFromInstanceQueues(executionId, instanceQueue) {
    let removed = false;
    return this.messenger.getAllMessagesFromQueue(instanceQueue)
      .then((messages) => {
        const filterMessages = messages.filter((message) =>
          message.payload.execution.id !== executionId
        );
        removed = messages.length > filterMessages.length;
        return filterMessages;
      })
      .then((messages) =>
        this.messenger.sendManyMessagesToOneQueue(messages, instanceQueue)
      )
      .then(() => removed);
  }

  /**
   * Send cancel message to queue
   * @private
   * @param {string} executionId
   * @param {string} instanceQueue - queue name
   * @returns {Promise}
   */
  sendCancelCommandToInstance(executionId, instanceQueue) {
    this.logger.info('Send cancel command to instance:', instanceQueue);
    const cancelMessage = this.getCancelMessage(executionId);

    return this.messenger.sendOneMessageToOneQueue(cancelMessage, instanceQueue);
  }

  /**
   * Get instance queue name
   * @private
   * @param {Object} instance
   * @param {string} instance.hostname
   * @returns {string} - queue name
   */
  getInstanceQueueName(instance) {
    return `cta.${instance.hostname}`;
  }

  /**
   * Get cancel message
   * @private
   * @param executionId
   * @returns {CtaJob}
   */
  getCancelMessage(executionId) {
    return {
      nature: {
        type: 'executions',
        quality: 'cancel',
      },
      payload: {
        execution: {
          id: executionId,
        },
      },
    };
  }

  /**
   * Send cancel state to execution data service
   * @private
   * @param {string} executionId
   * @param {Object} cancelProgresses
   * @returns {Promise}
   */
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
          this.logger.error(`Cannot send canceled state to EDS for execution:${executionId} ` +
            `hostname:${instance.hostname}`, err);
        });
      }
      return Promise.resolve();
    });

    return Promise.all(promises);
  }

}

module.exports = ExecutionCancelation;
