'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const _ = require('lodash');

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - sendComandToInstances', function() {

  const inputJob = require('./run.sample.testdata.js');
  const execution = {
    id: '1234567890',
    commandsCount: 1,
    instances: [
      { hostname: 'machine1' },
      { hostname: 'machine2' }
    ]
  };

  let sandbox;
  let helper;
  let stubSendDirectCommandToInstances;
  let stubSendSharedCommandToInstances;
  let stubLoggerError;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubSendDirectCommandToInstances = sandbox.stub(helper, 'sendDirectCommandToInstances');
    stubSendSharedCommandToInstances = sandbox.stub(helper, 'sendSharedCommandToInstances');
    stubLoggerError = sandbox.stub(helper.logger, 'error');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', function() {

    context('when it is MONO or STRESS mode', function() {

      it('should call sendDirectCommandToInstances method', function() {
        const contextInputMock = FlowControlUtils.createContext(inputJob);
        stubSendDirectCommandToInstances.resolves();

        const promise = helper.sendCommandToInstances(contextInputMock, execution);
        return promise.then(() => {
          sinon.assert.calledWith(stubSendDirectCommandToInstances,
            inputJob.payload.scenario, inputJob.payload.configuration, execution);
        });

      });

    });

    context('when it is GROUP or PARALLEL mode', function() {

      it('should call sendSharedCommandToInstances method', function() {
        const _inputJob = _.cloneDeep(inputJob);
        _inputJob.payload.configuration.runMode = 'group';
        const contextInputMock = FlowControlUtils.createContext(_inputJob);
        stubSendSharedCommandToInstances.resolves();

        const promise = helper.sendCommandToInstances(contextInputMock, execution);
        return promise.then(() => {
          sinon.assert.calledWith(stubSendSharedCommandToInstances,
            _inputJob.payload.scenario, _inputJob.payload.configuration, execution);
        });

      });

    });
  });

  context('when runMode is not correct', function() {

    it('throws an error', function() {
      const _inputJob = _.cloneDeep(inputJob);
      _inputJob.payload.configuration.runMode = 'whatever';
      const contextInputMock = FlowControlUtils.createContext(_inputJob);

      return expect(function() {
        helper.sendCommandToInstances(contextInputMock, execution)
      }).to.throw('runMode is not correct: whatever');
    });
  });

  context('when sendDirectCommandToInstances rejects an error', function() {

    it('should writes log and reject the error', function() {
      const _inputJob = _.cloneDeep(inputJob);
      const contextInputMock = FlowControlUtils.createContext(_inputJob);
      const err = new Error('Something went wrong');
      stubSendDirectCommandToInstances.rejects(err);

      const promise = helper.sendCommandToInstances(contextInputMock, execution);
      return expect(promise).to.eventually.be.rejected
        .then(() => {
          sinon.assert.calledWith(stubLoggerError, sinon.match(err.message));
        });
    });
  });

});
