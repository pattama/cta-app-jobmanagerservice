'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;


const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const inputJob = require('./run.sample.testdata.js');

describe('BusinessLogics - Execution - Run - acknowledgeMessage', () => {
  let sandbox;
  let helper;
  let stubMessengerAcknowledge;
  let stubLoggerError;
  let contextInputMock;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubMessengerAcknowledge = sandbox.stub(helper.messenger, 'acknowledgeMessage');
    stubLoggerError = sandbox.stub(helper.logger, 'error');

    contextInputMock = FlowControlUtils.createContext(inputJob);
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', () => {
    it('should resolve', () => {
      stubMessengerAcknowledge.returns(Promise.resolve());
      return helper.acknowledgeMessage(contextInputMock)
        .then(() => {
          sinon.assert.calledWith(stubMessengerAcknowledge, contextInputMock.data.id);
        });
    });
  });

  context('when messenger.acknowledgeMessage reject error', () => {
    it('should emit error event on inputContext', () => {
      const err = {
        returnCode: 'error',
        brickName: 'cta-io',
        response: new Error('Cannot acknowledge the message'),
      };
      stubMessengerAcknowledge.returns(Promise.reject(err));

      const promise = helper.acknowledgeMessage(contextInputMock);
      return expect(promise).to.eventually.be.rejectedWith(err)
        .then(() => {
          sinon.assert.calledWith(stubMessengerAcknowledge, contextInputMock.data.id);
          sinon.assert.calledWithMatch(stubLoggerError, contextInputMock.data.id);
        });
    });
  });
});
