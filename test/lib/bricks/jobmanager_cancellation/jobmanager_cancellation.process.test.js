'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

require('sinon-as-promised');

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const executionsResources = require('../../../resources/executions');

const executionRest = require('../../../../lib/httprequest/executions');
const instancesRest = require('../../../../lib/httprequest/instances');

const JobManagerCancellation = require('../../../../lib/bricks/jobmanager_cancellation');

const cementHelperMock = new CementHelperMock();

describe('JobManagerCancellation.process', () => {
  let jobManagerCancellation;
  let sandbox;
  let mockExecutionRest;
  let mockInstancesRest;

  beforeEach(() => {
    jobManagerCancellation = new JobManagerCancellation(cementHelperMock, { name: 'mock' });
    sandbox = sinon.sandbox.create();

    mockExecutionRest = sandbox.mock(executionRest);
    mockInstancesRest = sandbox.mock(instancesRest);
  });

  afterEach(() => {
    mockExecutionRest.verify();
    mockInstancesRest.verify();

    sandbox.restore();
  });

  describe('OnlyExecutionID', () => {
    it('should run process correctly', () => {
      const responseExecution = executionsResources.completedExecution;
      responseExecution.instances = [
        { hostname: 'hostname1' },
        { hostname: 'hostname2' },
        { hostname: 'hostname3' },
      ];

      mockExecutionRest
        .expects('getExecution')
        .withArgs(responseExecution.id)
        .once()
        .resolves(responseExecution);

      const contextData = new ContextMock(cementHelperMock, {
        payload: {
          executionid: responseExecution.id,
        },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      const publishSpy = sandbox.spy(jobManagerCancellation.context, 'publish');

      return expect(jobManagerCancellation.process(contextData))
        .to.be.fulfilled.and.then((results) => {
          expect(results).eql(responseExecution.instances);
          expect(publishSpy.callCount).eql(responseExecution.instances.length);
        });
    });
  });

  describe('ExecutionObject', () => {
    it('should run process correctly', () => {
      const execution = executionsResources.completedExecution;
      execution.instances = [
        { hostname: 'hostname1' },
        { hostname: 'hostname2' },
        { hostname: 'hostname3' },
      ];

      const contextData = new ContextMock(cementHelperMock, {
        payload: { execution },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      const publishSpy = sandbox.spy(jobManagerCancellation.context, 'publish');

      return expect(jobManagerCancellation.process(contextData))
        .to.be.fulfilled.and.then((results) => {
          expect(results).eql(execution.instances);
          expect(publishSpy.callCount).eql(execution.instances.length);
        });
    });
  });
});
