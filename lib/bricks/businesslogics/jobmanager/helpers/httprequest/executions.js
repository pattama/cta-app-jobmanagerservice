'use strict';
const httpStatus = require('http-status');
const url = require('url');

const configHelper = require('../helpers/config_helper');
const EVENTS = require('../enum/events');

class ExecutionRequest {
  constructor(cementHelper, logger) {
    this.cementHelper = cementHelper;
    this.logger = logger;
  }

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
          quality: 'exec'
        },
        payload: options
      }
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if(httpStatus.OK === result.status) {
          resolve(result.data);
        } else {
          reject(new Error(`Cannot make a HTTP request for getting execution: ${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName: brickName,
          response: err
        })
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName: brickName,
          response: err
        })
      });
      context.publish();
    });
  }

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
          quality: 'exec'
        },
        payload: options
      }
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if(result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error(`Cannot make a HTTP request for updating execution: ${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName: brickName,
          response: err
        })
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName: brickName,
          response: err
        })
      });
      context.publish();
    });
  }

  /**
   * createExecution - send POST request to execution brick
   *
   * @param  {Object} data
   * @return {Promise}
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
          quality: 'exec'
        },
        payload: options
      }
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if(result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error(`Cannot make a HTTP request for creating execution: ${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName: brickName,
          response: err
        })
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName: brickName,
          response: err
        })
      });
      context.publish();
    });
  }

  createResult(resultData) {

    console.log('...',configHelper.getExecutionsUrl());
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: url.resolve(configHelper.getExecutionsUrl(), '/results'),
        body: resultData
      };
      const data = {
        nature: {
          type: 'request',
          quality: 'exec'
        },
        payload: options
      }
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if(result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error(`Cannot make a HTTP request for creating result: ${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName: brickName,
          response: err
        })
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName: brickName,
          response: err
        })
      });
      context.publish();
    });
  }

  createState(stateData) {

    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: url.resolve(configHelper.getExecutionsUrl(), '/states'),
        body: stateData
      };
      const data = {
        nature: {
          type: 'request',
          quality: 'exec'
        },
        payload: options
      }
      const context = this.cementHelper.createContext(data);
      context.on(EVENTS.DONE, (brickName, result) => {
        if(result.status < httpStatus.BAD_REQUEST) {
          resolve(result.data);
        } else {
          reject(new Error(`Cannot make a HTTP request for creating state: ${result.status}\n${result.data}`));
        }
      });
      context.on(EVENTS.REJECT, (brickName, err) => {
        reject({
          returnCode: EVENTS.REJECT,
          brickName: brickName,
          response: err
        })
      });
      context.on(EVENTS.ERROR, (brickName, err) => {
        reject({
          returnCode: EVENTS.ERROR,
          brickName: brickName,
          response: err
        })
      });
      context.publish();
    });
  }
}


module.exports = ExecutionRequest;
