const request = require('request');
const httpStatus = require('http-status');

const configHelper = require('../helpers/config_helper');

function getExecution(executionId) {
  const options = {
    method: 'GET',
    uri: `${configHelper.getExecutionsUrl()}/${executionId}`,
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

/**
 * createExecution - send POST request to execution brick
 *
 * @param  {Object} data
 * @return {Promise}
 */
function updateExecution(id, data) {
  const options = {
    method: 'PATCH',
    uri: `${configHelper.getExecutionsUrl()}/${id}`,
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
function createExecution(data) {  // todo: change to createExecution
  const options = {
    method: 'POST',
    uri: configHelper.getExecutionsUrl(),
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
  createExecution,
  getExecution,
  updateExecution,
};
