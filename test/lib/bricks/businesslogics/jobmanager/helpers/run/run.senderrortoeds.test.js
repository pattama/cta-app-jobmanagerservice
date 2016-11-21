'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-as-promised'));

const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - sendErrorToEds', () => {
  const executionId = '1234567890';
  const errorMessage = 'something went wrong';

  let sandbox;
  let helper;
  let stubRestCreateResult;
  let stubRestCreateState;
  let stubLoggerError;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubRestCreateResult = sandbox.stub(helper.executionRequest, 'createResult');
    stubRestCreateState = sandbox.stub(helper.executionRequest, 'createState');
    stubLoggerError = sandbox.stub(helper.logger, 'error');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', () => {
    it('should resolve', () => {
      stubRestCreateResult.resolves();
      stubRestCreateState.resolves();

      const promise = helper.sendErrorToEds(executionId, errorMessage);
      return promise.then(() => {
        sinon.assert.calledWith(stubRestCreateResult, sinon.match({
          executionId,
          testId: errorMessage,
          status: 'failed',
          index: 1,
        }));
        sinon.assert.calledWith(stubRestCreateState, sinon.match({
          executionId,
          status: 'finished',
          index: 1,
        }));
      });
    });
  });

  context('when restApi has an error', () => {
    it('should writes log and rejects error', () => {
      const error404 = new Error('HTTP 404: Not Found');
      stubRestCreateResult.rejects(error404);

      const promise = helper.sendErrorToEds(executionId, errorMessage);
      return promise.then(() => {
        sinon.assert.calledWith(stubLoggerError, sinon.match(error404.message));
      });
    });
  });
});
