'use strict';

const sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - createExecution', function() {

  const inputJob = require('./run.sample.testdata.js');

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

  context('when everything ok', function() {

    it('should resolve execution', function() {
      const createdExecution = {
        id: '1234567980'
      };
      stubRestCreateExecution.resolves(createdExecution);

      const promise = helper.createExecution(contextInputMock);
      return expect(promise).to.eventually.equal(createdExecution)
        .then(() => {
          sinon.assert.calledWith(stubRestCreateExecution, {
            scenarioId: inputJob.payload.scenario.id,
            userId: inputJob.payload.user.id,
            requestTimestamp: inputJob.payload.requestTimestamp,
            pendingTimeout: inputJob.payload.pendingTimeout,
            runningTimeout: inputJob.payload.runningTimeout
          });
        });

    });

  });

});
