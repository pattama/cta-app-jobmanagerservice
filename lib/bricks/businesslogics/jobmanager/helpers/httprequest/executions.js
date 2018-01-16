/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const httpStatus = require('http-status');
const url = require('url');

const configHelper = require('../helpers/config_helper');
const EVENTS = require('../enum/events');
/**
 * Rest API client for Execution Data Service class
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class ExecutionRequest {
  constructor(cementHelper, logger) {
    this.cementHelper = cementHelper;
    this.logger = logger;
  }

  /**
   * Retrieve execution by execution ID
   *
   * @param {string} executionId - execution ID
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response
   */
  getExecution(executionId) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `${configHelper.getExecutionsUrl()}/${executionId}`,
        json: true,
      };
      const data = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: options,
      };
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if (httpStatus.OK === result.status) {
          resolve(result.data);
        } else {
          reject(new Error('Cannot make a HTTP request for getting execution: ' +
            `${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName,
          response: err,
        });
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName,
          response: err,
        });
      });
      context.publish();
    });
  }

  /**
   * Update execution for given executionId with executionData
   *
   * @param {string} id - execution ID
   * @param {Object} executionData
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response
   */
  updateExecution(id, executionData) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'PATCH',
        url: `${configHelper.getExecutionsUrl()}/${id}`,
        body: executionData,
      };
      const data = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: options,
      };
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if (result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error('Cannot make a HTTP request for updating execution: ' +
            `${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName,
          response: err,
        });
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName,
          response: err,
        });
      });
      context.publish();
    });
  }

  /**
   * Create execution - send POST request
   *
   * @param {Object} executionData
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response
   */
  createExecution(executionData) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: configHelper.getExecutionsUrl(),
        body: executionData,
      };
      const data = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: options,
      };
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if (result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error('Cannot make a HTTP request for creating execution:' +
            `${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName,
          response: err,
        });
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName,
          response: err,
        });
      });
      context.publish();
    });
  }

  /**
   * Create Result
   *
   * @param {Object} resultData
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response
   */
  createResult(resultData) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: url.resolve(configHelper.getExecutionsUrl(), 'results'),
        body: resultData,
      };
      const data = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: options,
      };
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if (result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error('Cannot make a HTTP request for creating result: ' +
            `${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName,
          response: err,
        });
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName,
          response: err,
        });
      });
      context.publish();
    });
  }

  /**
   * Create State
   *
   * @param {Object} stateData
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response
   */
  createState(stateData) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: url.resolve(configHelper.getExecutionsUrl(), 'states'),
        body: stateData,
      };
      const data = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: options,
      };
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if (result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error('Cannot make a HTTP request for creating state: ' +
            `${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName,
          response: err,
        });
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName,
          response: err,
        });
      });
      context.publish();
    });
  }
}


module.exports = ExecutionRequest;
