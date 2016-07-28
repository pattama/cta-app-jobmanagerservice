'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const executionResources = require('../../../resources/executions');

const JobManagerCancellation = require('../../../../lib/bricks/jobmanager_cancellation');

describe('JobManagerCancellation.validate', () => {
  let jobManager;
  const cementHelperMock = new CementHelperMock();

  before(() => {
    jobManager = new JobManagerCancellation(cementHelperMock, { name: 'mock' });
  });

  describe('WithOnlyId', () => {
    it('should have correct properties', (done) => {
      const contextData = new ContextMock(cementHelperMock, {
        payload: {
          executionid: executionResources.completedExecution.id,
        },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      expect(jobManager.validate(contextData))
        .to.be.fulfilled.and.notify(done);
    });

    it('should reject if payload does not have executionid', () => {
      const contextData = new ContextMock(cementHelperMock, {
        payload: {
          bug: executionResources.completedExecution.id,
        },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      return expect(jobManager.validate(contextData))
        .to.be.rejected.and.then((reason) => {
          expect(reason instanceof Error).equal(true);
          expect(reason.message).equal('executionid field is required');
        });
    });
  });
  describe('WithExecutionObject', () => {
    it('should have correct properties', (done) => {
      const contextData = new ContextMock(cementHelperMock, {
        payload: {
          execution: executionResources.completedExecution,
        },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      expect(jobManager.validate(contextData))
        .to.be.fulfilled.and.notify(done);
    });
  });
});
