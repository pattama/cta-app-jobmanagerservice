'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const mock = require('mock-require');

const path = require('path');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const executionsHttpRequestPath = path.join(BusinessLogicsUtils.HelperPath, '/httprequest/executions');
const configHelperPath = path.join(BusinessLogicsUtils.HelperPath, '/helpers/config_helper.js');


describe('BusinessLogics - JobManager - httprequest - createResult', function() {


  let sandbox;
  let stubRequest;
  let executionsHttpRequest;
  beforeEach(() => {
    mock(configHelperPath, {
      getExecutionsUrl: function() {
        return 'whatever.com';
      }
    });
    sandbox = sinon.sandbox.create();
    stubRequest = sandbox.stub();
    mock('cta-tool-request', function() {
      return { exec: stubRequest };
    });

    executionsHttpRequest = mock.reRequire(executionsHttpRequestPath);
  });
  afterEach(() => {
    mock.stopAll();
  });

  context('when everything is ok', function() {

    it('should resolves the HTTP body', function() {
      const result = {
        status: 200,
        data: 'Kimi No Na wa'
      };
      stubRequest.resolves(result);
      const promise = executionsHttpRequest.createResult('whateverData');
      return expect(promise).to.eventually.equal(result.data);
    });
  });

  context('when HTTP request returns an error', function() {

    it('should rejects the error', function() {
      const error = new Error('ECONNRESET');
      stubRequest.rejects(error);
      const promise = executionsHttpRequest.createResult('whateverData');
      return expect(promise).to.eventually.rejectedWith(error.message);
    })
  });

  context('when HTTP request does not return 200', function() {
    it('should rejects an error', function() {
      const result = {
        status: 404,
        data: 'Not Found'
      };
      stubRequest.resolves(result);
      const promise = executionsHttpRequest.createResult('whateverData');
      return expect(promise).to.eventually.rejectedWith(result.status);
    });
  })
});
