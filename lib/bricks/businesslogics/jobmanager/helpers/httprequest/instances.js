const httpStatus = require('http-status');
const _ = require('lodash');

const configHelper = require('../helpers/config_helper');
const Request = require('cta-tool-request');
const request = new Request();

function getMatchingInstances(matchingData) {
  if (_.isEmpty(matchingData)) {
    return Promise.reject(new Error('matchingQuery is not define or empty'));
  }
  const options = {
    method: 'POST',
    url: `${configHelper.getInstancesUrl()}/matchingInstances`,
    json: true,
    body: matchingData,
  };

  return request.exec(options).then((result) => {
    if(result.status < httpStatus.BAD_REQUEST) {
      return result.data;
    }
    throw new Error(`Cannot make a HTTP request for getting matching instances: ${result.status}\n${result.data}`)
  });
}

module.exports = {
  getMatchingInstances,
};
