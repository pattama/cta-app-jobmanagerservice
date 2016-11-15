'use strict';
const httpStatus = require('http-status');
const _ = require('lodash');

const configHelper = require('../helpers/config_helper');
const EVENTS = require('../enum/events');

class InstanceRequest {

  constructor(cementHelper, logger) {
    this.cementHelper = cementHelper;
    this.logger = logger;
  }

  getMatchingInstances(matchingData) {
    if (_.isEmpty(matchingData)) {
      return Promise.reject(new Error('matchingQuery is not define or empty'));
    }

    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: `${configHelper.getInstancesUrl()}/matchingInstances`,
        body: matchingData,
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
          if(typeof result.data === 'string') { //TODO - remove this if instance-data-service is done
            resolve(JSON.parse(result.data));
          } else {
            resolve(result.data);
          }
        } else {
          reject(new Error(`Cannot make a HTTP request for getting matching instances: ${result.status}\n${result.data}`));
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

module.exports = InstanceRequest;
