const request = require('request');
const httpStatus = require('http-status');
const url = require('url');

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
      if(httpStatus.OK === response.statusCode) {
        return resolve(body);
      }
      return reject(new Error(`Cannot make a HTTP request for getting execution: ${response.statusCode}\n${body}`));
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
      if(response.statusCode < httpStatus.BAD_REQUEST) {
        return resolve(body);
      }
      return reject(new Error(`Cannot make a HTTP request for updating execution: ${response.statusCode}\n${body}`));
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
      if(response.statusCode < httpStatus.BAD_REQUEST) {
        return resolve(body);
      }
      return reject(new Error(`Cannot make a HTTP request for creating execution: ${response.statusCode}\n${body}`));
    });
  });
}

function createResult(data) {  // todo: change to createExecution
  const options = {
    method: 'POST',
    uri: url.resolve(configHelper.getExecutionsUrl(), '/results'),
    body: data,
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if(response.statusCode < httpStatus.BAD_REQUEST) {
        return resolve(body);
      }
      return reject(new Error(`Cannot make a HTTP request for creating result: ${response.statusCode}\n${body}`));
    });
  });
}

function createState(data) {  // todo: change to createExecution
  const options = {
    method: 'POST',
    uri: url.resolve(configHelper.getExecutionsUrl(), '/states'),
    body: data,
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if(response.statusCode < httpStatus.BAD_REQUEST) {
        return resolve(body);
      }
      return reject(new Error(`Cannot make a HTTP request for creating state: ${response.statusCode}\n${body}`));
    });
  });
}


module.exports = {
  createExecution,
  getExecution,
  updateExecution,
  createResult,
  createState,
};
