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

const JobManagerCancellation = require('../../../../lib/bricks/jobmanager_cancelation');

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
    describe('reject', () => {
      it('should run process correctly', () => {
        const execution = executionsResources.completedExecution;
        execution.instances = [
          { hostname: 'hostname1' },
          { hostname: 'hostname2' },
          { hostname: 'hostname3' },
        ];

        mockExecutionRest
          .expects('getExecution')
          .withArgs(execution.id)
          .once()
          .resolves(execution);

        const contextData = new ContextMock(cementHelperMock, {
          payload: {
            executionid: execution.id,
          },
          nature: {
            type: 'testtype',
            quality: 'testquality',
          },
        });

        ContextMock.prototype.publish = function publish() {
          if (!this.emitedEvent) {
            this.emitedEvent = true;
            this.emit('reject');
          }
        };

        const publishSpy = sandbox.spy(ContextMock.prototype, 'publish');

        return expect(jobManagerCancellation.process(contextData))
          .to.be.fulfilled.and.then((results) => {
            expect(results).eql(execution.instances);
            expect(publishSpy.callCount).eql(execution.instances.length * 2);
          });
      });
    });
    describe('done', () => {
      it('should run process correctly', () => {
        const execution = executionsResources.completedExecution;
        execution.instances = [
          { hostname: 'hostname1' },
          { hostname: 'hostname2' },
          { hostname: 'hostname3' },
        ];

        mockExecutionRest
          .expects('getExecution')
          .withArgs(execution.id)
          .once()
          .resolves(execution);

        const contextData = new ContextMock(cementHelperMock, {
          payload: {
            executionid: execution.id,
          },
          nature: {
            type: 'testtype',
            quality: 'testquality',
          },
        });

        ContextMock.prototype.publish = function publish() {
          this.emit('done');
        };

        const publishSpy = sandbox.spy(ContextMock.prototype, 'publish');

        return expect(jobManagerCancellation.process(contextData))
          .to.be.fulfilled.and.then((results) => {
            expect(results).eql(execution.instances);
            expect(publishSpy.callCount).eql(execution.instances.length);
          });
      });
    });
  });

  describe('ExecutionObject', () => {
    describe('reject', () => {
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

        ContextMock.prototype.publish = function publish() {
          if (!this.emitedEvent) {
            this.emitedEvent = true;
            this.emit('reject');
          }
        };
        const publishSpy = sandbox.spy(ContextMock.prototype, 'publish');

        return expect(jobManagerCancellation.process(contextData))
          .to.be.fulfilled.and.then((results) => {
            expect(results).eql(execution.instances);
            expect(publishSpy.callCount).eql(execution.instances.length * 2);
          });
      });
    });
    describe('done', () => {
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

        ContextMock.prototype.publish = function publish() {
          this.emit('done');
        };
        const publishSpy = sandbox.spy(ContextMock.prototype, 'publish');

        return expect(jobManagerCancellation.process(contextData))
          .to.be.fulfilled.and.then((results) => {
            expect(results).eql(execution.instances);
            expect(publishSpy.callCount).eql(execution.instances.length);
          });
      });
    });
  });
});
