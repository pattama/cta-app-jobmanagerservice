/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

const EVENTS = require('./helpers/enum/events');

/**
 * Messenger for interacting with CTA-IO
 *
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class Messenger {

  constructor(cementHelper, logger) {
    this.cementHelper = cementHelper;
    this.logger = logger;
  }

  /**
   * Retrieve all messages of given queue name
   *
   * @param {string} - queue name
   * @returns {Promise.<Array.<Job>>} - resolves array of job
   */
  getAllMessagesFromQueue(queue) {
    const messages = [];
    const messaging = this.cementHelper.dependencies.messaging;
    const getMessages = function getMessages() {
      return messaging.get({ queue, ack: 'auto' })
        .then((data) => {
          const content = data.result.content;
          if (content) {
            messages.push(content);
            return getMessages();
          }
          return null;
        });
    };
    return getMessages().then(() => messages);
  }

  /**
   * Send a message to a queue
   *
   * @param {Object} message - CTA Job
   * @param {string} queue - queue name
   * @param {Object} options
   * @param {boolean} options.autodelete
   * @param {number} options.expires - milliseconds to delete queue
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response - response from CTA-IO
   */
  sendOneMessageToOneQueue(message, queue, options) {
    const that = this;
    return new Promise((resolve, reject) => {
      const payload = {
        queue,
        content: message,
      };
      if (options) {
        if (typeof options.autoDelete !== 'undefined') {
          payload.autoDelete = options.autoDelete;
        }
        if (typeof options.expires !== 'undefined') {
          payload.expires = options.expires;
        }
      }
      const sentContext = that.cementHelper.createContext({
        nature: {
          type: 'messages',
          quality: 'produce',
        },
        payload,
      });
      sentContext.on(EVENTS.DONE, (brickName, response) => {
        resolve({
          returnCode: EVENTS.DONE,
          brickName,
          response,
        });
      });
      sentContext.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName,
          response: err,
        });
      });
      sentContext.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName,
          response: err,
        });
      });
      sentContext.publish();
    });
  }

  /**
   * Send a message to many queues
   *
   * @param {Object} message - CTA Job
   * @param {Array.<string>} queues - array of queue name
   * @param {Object} options
   * @param {boolean} options.autodelete
   * @param {number} options.expires - milliseconds to delete queue
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response - response from CTA-IO
   */
  sendOneMessageToManyQueues(message, queues, options) {
    let promise = Promise.resolve();
    queues.forEach((queue) => {
      promise = promise.then(() =>
        this.sendOneMessageToOneQueue(message, queue, options)
      );
    });

    return promise;
  }

  /**
   * Send many messages to a queue
   *
   * @param {Array.<Object>} messages - array of CTA Job
   * @param {string} queue - queue name
   * @param {Object} options
   * @param {boolean} options.autodelete
   * @param {number} options.expires - milliseconds to delete queue
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response - response from CTA-IO
   */
  sendManyMessagesToOneQueue(messages, queue, options) {
    const that = this;
    let promise = Promise.resolve();
    messages.forEach((message) => {
      promise = promise.then(() =>
        that.sendOneMessageToOneQueue(message, queue, options)
      );
    });

    return promise;
  }


  /**
   * Acknowledge message
   *
   * @param {string} ackId
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response - response from CTA-IO
   */
  acknowledgeMessage(ackId) {
    const that = this;
    return new Promise((resolve, reject) => {
      const sentContext = that.cementHelper.createContext({
        nature: {
          type: 'messages',
          quality: 'acknowledge',
        },
        payload: {
          id: ackId,
        },
      });
      sentContext.on(EVENTS.DONE, (brickName, response) => {
        resolve({
          returnCode: EVENTS.DONE,
          brickName,
          response,
        });
      });
      sentContext.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName,
          response: err,
        });
      });
      sentContext.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName,
          response: err,
        });
      });
      sentContext.publish();
    });
  }
}

module.exports = Messenger;
