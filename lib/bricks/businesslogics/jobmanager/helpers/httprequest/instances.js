/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

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
  getMatchingInstances(criteriaData) {
    const matchingData = criteriaData;
    if (_.isEmpty(matchingData)) {
      return Promise.reject(new Error('matchingQuery is not define or empty'));
    }

    return new Promise((resolve, reject) => {
      let hostname = undefined;
      if (matchingData.properties && matchingData.properties.hostname) {
        hostname = `hostname=${matchingData.properties.hostname}`;
        delete matchingData.properties.hostname;
      }
      let queryString = InstanceRequest.serializeToQueryString(matchingData);
      queryString = [hostname, queryString].filter((val) => val).join('&');

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
    function stringifyRecursive(parent, obj) {
      if (Array.isArray(obj)) {
        const join = obj.map((item) => item).join(',');
        return `${parent}=${join}`;
      } else if (typeof obj === 'object') {
        const elements = [];
        Object.keys(obj).forEach((key) => {
          const p = parent ? `${parent}.${key}` : key;
          const value = stringifyRecursive(p, obj[key]);
          elements.push(value);
        });
        return elements.join('&');
      }
      return `${parent}=${encodeURIComponent(obj)}`;
    }

    return stringifyRecursive(null, matchingData);
  }
}

module.exports = InstanceRequest;
