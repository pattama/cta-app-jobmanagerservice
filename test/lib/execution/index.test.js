const execution = require('../../../lib/execution');
const configHelper = require('../../../lib/config.helper');
const nock = require('nock');
const httpStatus = require('http-status');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const sinon = require('sinon');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Execution', () => {
  describe('POST', () => {
    it('should create successfully', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .reply(httpStatus.CREATED, {
          type: 'execution',
        });

      return expect(execution.sendPostRequest(testData))
        .to.be.fulfilled.and.then((result) => {
          expect(result.statusCode).equal(httpStatus.CREATED);
          expect(result.execution).eql({ type: 'execution' });

          expect(nockExecutionPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });

    it('should handle httpStatus 500+ error', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .reply(httpStatus.INTERNAL_SERVER_ERROR);

      return expect(execution.sendPostRequest(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.statusCode).equal(httpStatus.INTERNAL_SERVER_ERROR);

          expect(nockExecutionPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });

    it('should handle httpStatus 400+ error', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .reply(httpStatus.BAD_REQUEST);

      return expect(execution.sendPostRequest(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.statusCode).equal(httpStatus.BAD_REQUEST);

          expect(nockExecutionPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });

    it('should handle error', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getExecutionUrl').returns('http://abc.com/execution');
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionUrl())
        .post('', testData)
        .replyWithError({ code: 'ECONNRESET' });

      return expect(execution.sendPostRequest(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.code).equal('ECONNRESET');

          expect(nockExecutionPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });
  });
});
