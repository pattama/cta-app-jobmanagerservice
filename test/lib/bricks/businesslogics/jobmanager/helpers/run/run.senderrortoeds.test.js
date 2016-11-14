'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - sendErrorToEds', function() {

  const inputJob = require('./run.sample.testdata.js');
  const executionId = '1234567890';
  const errorMessage = 'something went wrong';

  let sandbox;
  let helper;
  let stubRestCreateResult;
  let stubRestCreateState;
  let stubLoggerError;
  let contextInputMock;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubRestCreateResult = sandbox.stub(helper.executionRest, 'createResult');
    stubRestCreateState = sandbox.stub(helper.executionRest, 'createState');
    stubLoggerError = sandbox.stub(helper.logger, 'error');

    contextInputMock = FlowControlUtils.createContext(inputJob);
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', function() {

    it('should resolve', function() {
      stubRestCreateResult.resolves();
      stubRestCreateState.resolves();

      const promise = helper.sendErrorToEds(executionId, errorMessage);
      return promise.then(() => {
        sinon.assert.calledWith(stubRestCreateResult, sinon.match({
          executionId: executionId,
          testId: errorMessage,
          status: 'failed',
          index: 1
        }));
        sinon.assert.calledWith(stubRestCreateState, sinon.match({
          executionId: executionId,
          status: 'finished',
          index: 1
        }));
      });

    });

  });

  context('when restApi has an error', function() {

    it('should writes log and rejects error', function() {
      const error404 = new Error('HTTP 404: Not Found');
      stubRestCreateResult.rejects(error404);

      const promise = helper.sendErrorToEds(executionId, errorMessage);
      return promise.then(() => {
        sinon.assert.calledWith(stubLoggerError, sinon.match(error404.message));
      });

    });

  });

});
