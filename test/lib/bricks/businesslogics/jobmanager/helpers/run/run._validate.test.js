'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const _ = require('lodash');

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - _validate', function() {

  const inputJob = require('./run.sample.testdata.js');

  let sandbox;
  let helper;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', function() {
    it('should resolve', function() {
      const contextInputMock = FlowControlUtils.createContext(inputJob);
      const promise = helper._validate(contextInputMock);
      return expect(promise).to.eventually.have.property('ok', 1);
    });
  });

  context('when payload is not an object', function() {
    const job = _.cloneDeep(inputJob);
    job.payload = 'not-an-object';
    const mockInputContext = FlowControlUtils.createContext(job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually.be.rejected;
    });
  });

  context('when payload has an invalid parameter', function() {
    const job = _.cloneDeep(inputJob);
    job.payload.scenario = 'not-an-objectid';
    const mockInputContext = FlowControlUtils.createContext(job);
    it('should reject', function() {
      const validatePromise = helper._validate(mockInputContext);
      return expect(validatePromise).to.eventually.be.rejected;
    });
  });
});
