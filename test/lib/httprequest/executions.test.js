'use strict';

const nock = require('nock');
const httpStatus = require('http-status');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const sinon = require('sinon');

chai.use(chaiAsPromised);

const expect = chai.expect;

const executions = require('../../../lib/httprequest/executions');
const configHelper = require('../../../lib/helpers/config_helper');

const executionsResources = require('../../resources/executions');

describe('Execution', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(configHelper, 'getExecutionsUrl').returns('http://abc.com/execution');
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('getExecution', () => {
    it('should get successfully', () => {
      const responseExecution = executionsResources.completedExecution;
      const query = {
        id: '12345678',
      };
      const nockExecutionGetReq = nock(configHelper.getExecutionsUrl())
        .get('')
        .query(query)
        .reply(httpStatus.OK, responseExecution);

      return expect(executions.getExecution(query))
        .to.be.fulfilled.and.then((result) => {
          expect(result).eql(responseExecution);

          expect(nockExecutionGetReq.isDone()).equal(true);
        });
    });

    describe('Errors', () => {
      it('should handle error', () => {
        const query = {
          id: '12345678',
        };
        const nockExecutionGetReq = nock(configHelper.getExecutionsUrl())
          .get('')
          .query(query)
          .replyWithError({ code: 'ECONNRESET' });

        return expect(executions.getExecution(query))
          .to.be.rejected.and.then((reason) => {
            expect(reason.code).equal('ECONNRESET');

            expect(nockExecutionGetReq.isDone()).equal(true);
          });
      });
      it('should handle httpStatus 500+ error', () => {
        const query = {
          id: '12345678',
        };
        const nockExecutionGetReq = nock(configHelper.getExecutionsUrl())
          .get('')
          .query(query)
          .reply(httpStatus.INTERNAL_SERVER_ERROR);

        return expect(executions.getExecution(query))
          .to.be.rejected.and.then((reason) => {
            expect(reason.statusCode).equal(httpStatus.INTERNAL_SERVER_ERROR);

            expect(nockExecutionGetReq.isDone()).equal(true);
          });
      });
      it('should handle httpStatus 400+ error', () => {
        const query = {
          id: '12345678',
        };
        const nockExecutionGetReq = nock(configHelper.getExecutionsUrl())
          .get('')
          .query(query)
          .reply(httpStatus.BAD_REQUEST);

        return expect(executions.getExecution(query))
          .to.be.rejected.and.then((reason) => {
            expect(reason.statusCode).equal(httpStatus.BAD_REQUEST);

            expect(nockExecutionGetReq.isDone()).equal(true);
          });
      });
    });
  });

  describe('upsertExecutions', () => {
    it('should upsert successfully', () => {
      // TODO: Talk with execution team about response data
      const testData = { test: 'test' };
      const nockExecutionPostReq = nock(configHelper.getExecutionsUrl())
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

    describe('Errors', () => {
      it('should handle httpStatus 500+ error', () => {
        const testData = { test: 'test' };
        const nockExecutionPostReq = nock(configHelper.getExecutionsUrl())
          .post('', testData)
          .reply(httpStatus.INTERNAL_SERVER_ERROR);

        return expect(executions.upsertExecutions(testData))
          .to.be.rejected.and.then((reason) => {
            expect(reason.statusCode).equal(httpStatus.INTERNAL_SERVER_ERROR);

            expect(nockExecutionPostReq.isDone()).equal(true);
          });
      });

      it('should handle httpStatus 400+ error', () => {
        const testData = { test: 'test' };
        const nockExecutionPostReq = nock(configHelper.getExecutionsUrl())
          .post('', testData)
          .reply(httpStatus.BAD_REQUEST);

        return expect(executions.upsertExecutions(testData))
          .to.be.rejected.and.then((reason) => {
            expect(reason.statusCode).equal(httpStatus.BAD_REQUEST);

            expect(nockExecutionPostReq.isDone()).equal(true);
          });
      });

      it('should handle error', () => {
        const testData = { test: 'test' };
        const nockExecutionPostReq = nock(configHelper.getExecutionsUrl())
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
});
