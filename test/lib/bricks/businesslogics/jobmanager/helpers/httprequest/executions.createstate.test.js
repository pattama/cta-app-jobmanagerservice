'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const mock = require('mock-require');

const path = require('path');
const EventEmitter = require('events');
const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const executionRequestPath = path.join(BusinessLogicsUtils.HelperPath, '/httprequest/executions');
const configHelperPath = path.join(BusinessLogicsUtils.HelperPath, '/helpers/config_helper.js');


describe('BusinessLogics - JobManager - httprequest - createState', () => {
  const brickName = 'cta-brick-request';

  let sandbox;
  let executionRequest;
  let contextMock;
  beforeEach(() => {
    mock(configHelperPath, {
      getExecutionsUrl: () => {
        'whatever.com';
      },
    });
    sandbox = sinon.sandbox.create();
    contextMock = new EventEmitter();
    contextMock.publish = sinon.stub();

    const ExecutionRequest = mock.reRequire(executionRequestPath);
    executionRequest = new ExecutionRequest(FlowControlUtils.defaultCementHelper,
      FlowControlUtils.defaultCementHelper);
    sandbox.stub(executionRequest.cementHelper, 'createContext')
      .returns(contextMock);
  });
  afterEach(() => {
    mock.stopAll();
    sandbox.restore();
  });

  context('when everything is ok', () => {
    it('should resolves the HTTP body', () => {
      const result = {
        status: 200,
        data: 'Kimi No Na wa',
      };
      const promise = executionRequest.createState('whateverData');
      contextMock.emit('done', brickName, result);
      return expect(promise).to.eventually.equal(result.data);
    });
  });

  context('when cta-brick-request returns a rejection', () => {
    it('should rejects the rejection', () => {
      const error = new Error('A rejection');
      const promise = executionRequest.createState('whateverData');
      contextMock.emit('reject', brickName, error);
      return expect(promise).to.eventually.rejectedWith({
        returnCode: 'reject',
        brickName,
        response: error,
      });
    });
  });

  context('when cta-brick-request returns an error', () => {
    it('should rejects the error', () => {
      const error = new Error('ECONNRESET');
      const promise = executionRequest.createState('whateverData');
      contextMock.emit('error', brickName, error);
      return expect(promise).to.eventually.rejectedWith({
        returnCode: 'error',
        brickName,
        response: error,
      });
    });
  });

  context('when HTTP request does not return 200', () => {
    it('should rejects an error', () => {
      const result = {
        status: 404,
        data: 'Not Found',
      };
      const promise = executionRequest.createState('whateverData');
      contextMock.emit('done', brickName, result);
      return expect(promise).to.eventually.rejectedWith(result.status);
    });
  });
});
