'use strict';

const executions = require('../../../lib/httprequest/executions');
const configHelper = require('../../../lib/helpers/config.helper');
const nock = require('nock');
const httpStatus = require('http-status');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const sinon = require('sinon');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Execution', () => {
  let sandbox;
  describe('POST', () => {
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('should upsert successfully', () => {
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');

      // TODO: Talk with execution team about response data
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .reply(httpStatus.OK, {
          type: 'execution',
        });

      return expect(executions.upsertExecutions(testData))
        .to.be.fulfilled.and.then((result) => {
          expect(result).eql({ type: 'execution' });

          expect(nockExecutionPostReq.isDone()).equal(true);
        });
    });

    it('should handle httpStatus 500+ error', () => {
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .reply(httpStatus.INTERNAL_SERVER_ERROR);

      return expect(executions.upsertExecutions(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.statusCode).equal(httpStatus.INTERNAL_SERVER_ERROR);

          expect(nockExecutionPostReq.isDone()).equal(true);
        });
    });

    it('should handle httpStatus 400+ error', () => {
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .reply(httpStatus.BAD_REQUEST);

      return expect(executions.upsertExecutions(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.statusCode).equal(httpStatus.BAD_REQUEST);

          expect(nockExecutionPostReq.isDone()).equal(true);
        });
    });

    it('should handle error', () => {
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .replyWithError({ code: 'ECONNRESET' });

      return expect(executions.upsertExecutions(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.code).equal('ECONNRESET');

          expect(nockExecutionPostReq.isDone()).equal(true);
        });
    });
  });
});
