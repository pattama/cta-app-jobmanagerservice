'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const inputJob = require('./run.sample.testdata.js');

describe('BusinessLogics - Execution - Run - createExecution', () => {
  let sandbox;
  let helper;
  let stubRestCreateExecution;
  let contextInputMock;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubRestCreateExecution = sandbox.stub(helper.executionRequest, 'createExecution');

    contextInputMock = FlowControlUtils.createContext(inputJob);
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', () => {
    it('should resolve execution', () => {
      const createdExecution = {
        id: '1234567980',
      };
      stubRestCreateExecution.resolves(createdExecution);

      const promise = helper.createExecution(contextInputMock);
      return expect(promise).to.eventually.equal(createdExecution)
        .then(() => {
          sinon.assert.calledWith(stubRestCreateExecution, {
            scenarioId: inputJob.payload.scenario.id,
            scenarioData: inputJob.payload.scenario,
            userId: inputJob.payload.user.id,
            requestTimestamp: inputJob.payload.requestTimestamp,
            pendingTimeout: inputJob.payload.pendingTimeout,
            runningTimeout: inputJob.payload.runningTimeout,
          });
        });
    });
  });
});
