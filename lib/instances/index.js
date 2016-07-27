const request = require('request');
const httpStatus = require('http-status');

const configHelper = require('../helpers/config.helper');

function getMatchingInstances(matchingData) {
  const options = {
    method: 'POST',
    url: `${configHelper.getInstancesUrl()}/matchingInstances`,
    json: true,
    body: matchingData,
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      if (httpStatus.INTERNAL_SERVER_ERROR <= response.statusCode) {
        return reject({
          statusCode: response.statusCode,
        });
      } else if (httpStatus.BAD_REQUEST <= response.statusCode) {
        return reject({
          statusCode: response.statusCode,
        });
      }

      return resolve({
        statusCode: response.statusCode,
        instances: body,
      });
    });
  });
}

module.exports = {
  getMatchingInstances,
};
