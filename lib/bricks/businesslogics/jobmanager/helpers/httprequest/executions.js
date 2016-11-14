const httpStatus = require('http-status');
const url = require('url');

const configHelper = require('../helpers/config_helper');
const Request = require('cta-tool-request');
const request = new Request();

function getExecution(executionId) {
  const options = {
    method: 'GET',
    url: `${configHelper.getExecutionsUrl()}/${executionId}`,
    json: true,
  };

  return request.exec(options).then((result) => {
    if(httpStatus.OK === result.status) {
      return result.data;
    }
    throw new Error(`Cannot make a HTTP request for getting execution: ${result.status}\n${result.data}`)
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
    url: `${configHelper.getExecutionsUrl()}/${id}`,
    body: data,
  };

  return request.exec(options).then((result) => {
    if(result.status < httpStatus.BAD_REQUEST) {
      return result.data;
    }
    throw new Error(`Cannot make a HTTP request for updating execution: ${result.status}\n${result.data}`)
  });
}
function createExecution(data) {  // todo: change to createExecution
  const options = {
    method: 'POST',
    url: configHelper.getExecutionsUrl(),
    body: data,
  };

  return request.exec(options).then((result) => {
    if(result.status < httpStatus.BAD_REQUEST) {
      return result.data;
    }
    throw new Error(`Cannot make a HTTP request for creating execution: ${result.status}\n${result.data}`)
  });
}

function createResult(data) {
  const options = {
    method: 'POST',
    url: url.resolve(configHelper.getExecutionsUrl(), '/results'),
    body: data,
    json: true,
  };

  return request.exec(options).then((result) => {
    if(result.status < httpStatus.BAD_REQUEST) {
      return result.data;
    }
    throw new Error(`Cannot make a HTTP request for creating result: ${result.status}\n${result.data}`)
  });
}

function createState(data) {
  const options = {
    method: 'POST',
    url: url.resolve(configHelper.getExecutionsUrl(), '/states'),
    body: data,
    json: true,
  };

  return request.exec(options).then((result) => {
    if(result.status < httpStatus.BAD_REQUEST) {
      return result.data;
    }
    throw new Error(`Cannot make a HTTP request for creating state: ${result.status}\n${result.data}`)
  });
}


module.exports = {
  createExecution,
  getExecution,
  updateExecution,
  createResult,
  createState,
};
