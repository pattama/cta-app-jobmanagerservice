'use strict';

const sinon = require('sinon');
require('sinon-as-promised');

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const inputJob = require('./run.sample.testdata.js');

describe('BusinessLogics - Execution - Run - _process', () => {
  let sandbox;
  let helper;
  let stubAcknowledgeMessage;
  let stubCreateExecution;
  let stubGetMatchingInstances;
  let stubUpdateExecution;
  let stubSendCommandToInstances;
  let stubSendErrorToEds;
  let contextInputMock;
  let stubEmit;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubAcknowledgeMessage = sandbox.stub(helper, 'acknowledgeMessage');
    stubCreateExecution = sandbox.stub(helper, 'createExecution');
    stubGetMatchingInstances = sandbox.stub(helper, 'getMatchingInstances');
    stubUpdateExecution = sandbox.stub(helper, 'updateExecution');
    stubSendCommandToInstances = sandbox.stub(helper, 'sendCommandToInstances');
    stubSendErrorToEds = sandbox.stub(helper, 'sendErrorToEds');

    contextInputMock = FlowControlUtils.createContext(inputJob);
    stubEmit = sandbox.stub(contextInputMock, 'emit');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', () => {
    it('should emit done event on inputContext', () => {
      const createdExecution = {
        id: '1234567890',
      };
      const matchingInstances = [
        { hostname: 'machine1' },
        { hostname: 'machine2' },
      ];
      const updatedExecution = {
        id: '1234567890',
        instances: matchingInstances,
      };
      stubAcknowledgeMessage.resolves();
      stubCreateExecution.resolves(createdExecution);
      stubGetMatchingInstances.resolves(matchingInstances);
      stubUpdateExecution.resolves(updatedExecution);
      stubSendCommandToInstances.resolves();

      return helper._process(contextInputMock)
        .then(() => {
          sinon.assert.calledWith(stubAcknowledgeMessage, contextInputMock);
          sinon.assert.calledWith(stubCreateExecution, contextInputMock);
          sinon.assert.calledWith(stubGetMatchingInstances, contextInputMock);
          sinon.assert.calledWith(stubUpdateExecution, contextInputMock,
            createdExecution, matchingInstances);
          sinon.assert.calledWith(stubSendCommandToInstances, contextInputMock,
            updatedExecution);
          sinon.assert.calledWith(stubEmit, 'done', contextInputMock.cementHelper.brickName,
            updatedExecution);
        });
    });
  });

  context('when acknowledgeMessage reject error', () => {
    it('should emit error event on inputContext', () => {
      const err = {
        returnCode: 'error',
        brickName: 'cta-io',
        response: new Error('Cannot acknowledge the message'),
      };
      stubAcknowledgeMessage.rejects(err);

      return helper._process(contextInputMock)
        .then(() => {
          sinon.assert.calledWith(stubAcknowledgeMessage, contextInputMock);
          sinon.assert.calledWith(stubEmit, err.returnCode, err.brickName, err.response);
        });
    });
  });

  context('when no matching instances found', () => {
    it('should emit error event on inputContext', () => {
      const createdExecution = {
        id: '1234567890',
      };
      const noMatchingInstancesError = new Error('No matching instances found');
      stubAcknowledgeMessage.resolves();
      stubCreateExecution.resolves(createdExecution);
      stubGetMatchingInstances.rejects(noMatchingInstancesError);
      stubSendErrorToEds.resolves();

      return helper._process(contextInputMock)
        .then(() => {
          sinon.assert.calledWith(stubAcknowledgeMessage, contextInputMock);
          sinon.assert.calledWith(stubCreateExecution, contextInputMock);
          sinon.assert.calledWith(stubGetMatchingInstances, contextInputMock);
          sinon.assert.calledWith(stubSendErrorToEds, createdExecution.id,
            noMatchingInstancesError.message);
          sinon.assert.calledWith(stubEmit, 'error', helper.cementHelper.brickName,
            noMatchingInstancesError);
        });
    });
  });
});
