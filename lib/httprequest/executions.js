const request = require('request');
const httpStatus = require('http-status');

const configHelper = require('../helpers/config.helper');


/**
 * upsertExecutions - send POST request to execution brick
 *
 * @param  {Object} data
 * @return {Promise}
 */
function upsertExecutions(data) {
  const options = {
    method: 'POST',
    uri: configHelper.getExecutionUrl(),
    body: data,
    json: true,
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

      return resolve(body);
    });
  });
}

module.exports = {
  upsertExecutions,
};
