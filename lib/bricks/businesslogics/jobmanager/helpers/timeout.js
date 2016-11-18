'use strict';

const validate = require('cta-common').validate;
const BaseHelper = require('../../base/basehelper');
const Messenger = require('../messenger');
const ExecutionRequest = require('./httprequest/executions');

const EVENTS = require('./enum/events');
const TIMEOUTPROGRESSES = require('./enum/timeoutprogresses');

/**
 * Business Logic Execution Helper Timeout class
 *
 * @augments BaseHelper
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class ExecutionTimeout extends BaseHelper {
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
    context.emit(EVENTS.DONE, that.cementHelper.brickName);
    const execution = context.data.payload.execution;
    this.executionTimeout(context)
      .then((timeoutProgresses) => {
        this.logger.info(`Execution was done timeout process:${execution.id}`, timeoutProgresses);   //TODO - change log level to debug
        return this.sendTimeoutStateToEds(execution.id, timeoutProgresses);
      })
      .catch((err) => {
        this.logger.error(`Cannot do timeout for execution:${execution.id}`, err);
      });
  }
  /**
   * Do timeout
   * @private
   * @param {Context} context - a Context
   */
  executionTimeout(context) {
    const execution = context.data.payload.execution;
    const instances = context.data.payload.execution.instances;
    const promises = instances.map((instance) => {
      const instanceQueue = this.getInstanceQueueName(instance);
      return this.removeMessageFromInstanceQueue(execution.id, instanceQueue)
        .then((removed) => {
          if(removed) {
            return TIMEOUTPROGRESSES.MESSAGEREMOVED;
          } else {
            return TIMEOUTPROGRESSES.MESSAGENOTFOUND;
          }
        })
        .catch((err) => {
          this.logger.error(`Cannot remove message of execution:${execution.id} for instance:${instance.hostname}`, err);
          return `fail: ${err.message}`;
        })

    });
    return Promise.all(promises)
      .then((removedArray) => {
        return this.getTimeoutProgressResponse(instances, removedArray);
      })
      .catch((err) => {
        this.logger.error(`Cannot remove message from instances queue: ${execution.id}`);
        throw err;
      })
  }

  removeMessageFromInstanceQueue(executionId, instanceQueue) {
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

  /**
   * create timeout progress
   * @private
   * @param {Array.<Instance>} instances
   * @param {Array.<string>} results
   */
  getTimeoutProgressResponse(instances, results) {
    return instances.map((instance, index) => {
      return {
        hostname: instance.hostname,
        timeoutProgress: results[index]
      }
    });
  }

  /**
   * Get instance queue name
   * @private
   * @param {Object} instance
   * @param {string} instance.hostname
   * @returns {string} - queue name
   */
  getInstanceQueueName(instance) {
    return 'cta.' + instance.hostname;
  }

  /**
   * Send timeout state to execution data service
   * @private
   * @param {string} executionId
   * @param {Object} timeoutProgresses
   * @returns {Promise}
   */
  sendTimeoutStateToEds(executionId, timeoutProgresses) {
    this.logger.info('Send timeout state for execution:', executionId);   //TODO - change log level to debug
    const promises = timeoutProgresses.map((instance) => {
      if(instance.timeoutProgress === TIMEOUTPROGRESSES.MESSAGEREMOVED) {
        return this.executionRequest.createState({
          executionId: executionId,
          timestamp: new Date().getTime(),
          status: 'timeout',
          index: 0,
          hostname: instance.hostname
        }).catch((err) => {
          this.logger.error(`Cannot send timeout state to EDS for execution:${executionId} hostname:${instance.hostname}`, err);
        });
      } else {  // if(timeout
        return Promise.resolve();
      }
    });

    return Promise.all(promises);
  }

}

module.exports = ExecutionTimeout;
