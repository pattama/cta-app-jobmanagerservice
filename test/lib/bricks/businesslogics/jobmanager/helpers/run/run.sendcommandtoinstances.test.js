'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const _ = require('lodash');

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const inputJob = require('./run.sample.testdata.js');

describe('BusinessLogics - Execution - Run - sendComandToInstances', () => {
  const execution = {
    id: '1234567890',
    commandsCount: 1,
    instances: [
      { hostname: 'machine1' },
      { hostname: 'machine2' },
    ],
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

  context('when everything ok', () => {
    context('when it is MONO or STRESS mode', () => {
      it('should call sendDirectCommandToInstances method', () => {
        const contextInputMock = FlowControlUtils.createContext(inputJob);
        stubSendDirectCommandToInstances.resolves();

        const promise = helper.sendCommandToInstances(contextInputMock, execution);
        return promise.then(() => {
          sinon.assert.calledWith(stubSendDirectCommandToInstances,
            inputJob.payload.scenario, inputJob.payload.configuration, execution);
        });
      });
    });

    context('when it is GROUP or PARALLEL mode', () => {
      it('should call sendSharedCommandToInstances method', () => {
        const inputJobGroup = _.cloneDeep(inputJob);
        inputJobGroup.payload.configuration.runMode = 'group';
        const contextInputMock = FlowControlUtils.createContext(inputJobGroup);
        stubSendSharedCommandToInstances.resolves();

        const promise = helper.sendCommandToInstances(contextInputMock, execution);
        return promise.then(() => {
          sinon.assert.calledWith(stubSendSharedCommandToInstances,
            inputJobGroup.payload.scenario, inputJobGroup.payload.configuration, execution);
        });
      });
    });
  });

  context('when runMode is not correct', () => {
    it('throws an error', () => {
      const inputJobWhatever = _.cloneDeep(inputJob);
      inputJobWhatever.payload.configuration.runMode = 'whatever';
      const contextInputMock = FlowControlUtils.createContext(inputJobWhatever);

      return expect(() =>
        helper.sendCommandToInstances(contextInputMock, execution)
      ).to.throw('runMode is not correct: whatever');
    });
  });

  context('when sendDirectCommandToInstances rejects an error', () => {
    it('should writes log and reject the error', () => {
      const inputJobNormal = _.cloneDeep(inputJob);
      const contextInputMock = FlowControlUtils.createContext(inputJobNormal);
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
