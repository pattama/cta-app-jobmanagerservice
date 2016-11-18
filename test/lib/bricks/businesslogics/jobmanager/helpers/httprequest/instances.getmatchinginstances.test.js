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
const instanceRequestPath = path.join(BusinessLogicsUtils.HelperPath, '/httprequest/instances');
const configHelperPath = path.join(BusinessLogicsUtils.HelperPath, '/helpers/config_helper.js');
const InstanceRequest = require(instanceRequestPath);


describe('BusinessLogics - JobManager - httprequest - getMatchingInstances', () => {
  const brickName = 'cta-brick-request';

  let sandbox;
  let instanceRequest;
  let contextMock;
  beforeEach(() => {
    mock(configHelperPath, {
      getInstancesUrl: () => {
        'whatever.com';
      },
    });
    sandbox = sinon.sandbox.create();
    contextMock = new EventEmitter();
    contextMock.publish = sinon.stub();

    instanceRequest = new InstanceRequest(FlowControlUtils.defaultCementHelper,
      FlowControlUtils.defaultCementHelper);
    sandbox.stub(instanceRequest.cementHelper, 'createContext')
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
        data: [{ hostName: 'machine1' }],
      };
      const promise = instanceRequest.getMatchingInstances('matchingData');
      contextMock.emit('done', brickName, result);
      return expect(promise).to.eventually.equal(result.data);
    });
  });

  context('when matchingData is undefined', () => {
    it('should rejects an error', () => {
      const promise = instanceRequest.getMatchingInstances(undefined);
      return expect(promise).to.eventually.rejectedWith('matchingQuery is not define or empty');
    });
  });

  context('when cta-brick-request returns a rejection', () => {
    it('should rejects the rejection', () => {
      const error = new Error('A rejection');
      const promise = instanceRequest.getMatchingInstances('matchingData');
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
      const promise = instanceRequest.getMatchingInstances('matchingData');
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
      const promise = instanceRequest.getMatchingInstances('matchingDataId');
      contextMock.emit('done', brickName, result);
      return expect(promise).to.eventually.rejectedWith(result.status);
    });
  });
});
