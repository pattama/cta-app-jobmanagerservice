const request = require('request');
const httpStatus = require('http-status');
const _ = require('lodash');

const configHelper = require('../helpers/config_helper');

function getMatchingInstances(matchingData) {
  const options = {
    method: 'POST',
    url: `${configHelper.getInstancesUrl()}/matchingInstances`,
    json: true,
    body: matchingData,
  };
  return new Promise((resolve, reject) => {
    if (_.isEmpty(options.body)) {
      reject(new Error('matchingQuery is not define or empty'));
    }
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if(response.statusCode < httpStatus.BAD_REQUEST) {
        return resolve(body);
      }
      return reject(new Error(`Cannot make a HTTP request for getting matching instances: ${response.statusCode}\n${body}`));
    });
  });
}

module.exports = {
  getMatchingInstances,
};
