'use strict';
const httpStatus = require('http-status');
const _ = require('lodash');

const configHelper = require('../helpers/config_helper');
const EVENTS = require('../enum/events');

/**
 * Rest API client for Instance Data Service class
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class InstanceRequest {

  constructor(cementHelper, logger) {
    this.cementHelper = cementHelper;
    this.logger = logger;
  }

  /**
   * Retrieve matching instances for given matchingData
   *
   * @param {Object} matchingData
   * @returns {Promise.<Object>} result
   * @returns {string} result.returnCode - done|reject|error
   * @returns {string} result.brickName
   * @returns {*} result.response
   */
  getMatchingInstances(matchingData) {
    if (_.isEmpty(matchingData)) {
      return Promise.reject(new Error('matchingQuery is not define or empty'));
    }

    return new Promise((resolve, reject) => {
      const queryString = InstanceRequest.serializeToQueryString(matchingData);
      const options = {
        method: 'GET',
        url: `${configHelper.getInstancesUrl()}?${queryString}`,
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
          // TODO - remove this if instance-data-service is done
          if (typeof result.data === 'string') {
            resolve(JSON.parse(result.data));
          } else {
            resolve(result.data.result);
          }
        } else {
          reject(new Error('Cannot make a HTTP request for getting matching instances:' +
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

  static serializeToQueryString(matchingData) {
    function stringifyRecursive(obj) {
      if (Array.isArray(obj)) {
        return obj.map((item) => stringifyRecursive(item)).join(',');
      } else if (typeof obj === 'object') {
        const elements = [];
        Object.keys(obj).forEach((key) => {
          const value = stringifyRecursive(obj[key]);
          if (value.indexOf('=') >= 0) {
            elements.push(`${key}.${value}`);
          } else {
            elements.push(`${key}=${value}`);
          }
        });
        return elements.join('&');
      }
      return encodeURIComponent(obj);
    }

    return stringifyRecursive(matchingData);
  }
}

module.exports = InstanceRequest;
