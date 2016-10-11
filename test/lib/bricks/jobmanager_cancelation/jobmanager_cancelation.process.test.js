'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

require('sinon-as-promised');

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const executionsResources = require('../../../resources/executions');

const executionRest = require('../../.././executions');
const instancesRest = require('../../.././instances');

const EVENTS = require('../../.././events');

const JobManagerCancellation = require('../../../../lib/bricks/businesslogics/jobmanager/helpers/jobmanager_cancelation');

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
      it('should run process correctly', (done) => {
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

        const expectedPublishContexts = execution.instances.map((instance) => {
          const returnVal = {
            id: `${contextData.data.id}-${execution.scenario.id}`,
            payload: {
              queue: instance.hostname,
              message: execution,
            },
            nature: contextData.data.nature,
          };
          return returnVal;
        });

        const expectedPublishCancelationContexts = execution.instances.map(() => {
          const returnVal = {
            id: '',
            payload: {
              jobid: '',
            },
            nature: {
              type: 'execution',
              quality: 'cancelation',
            },
          };
          return returnVal;
        });

        let actualCalledCount = 0;
        const actualPublishData = [];
        let actualCancelationCalledCount = 0;
        const actualPublishCancelationData = [];
        sandbox.stub(ContextMock.prototype, 'publish', function publish() {
          if (this.data.payload.queue) {
            actualCalledCount++;
            this.emitedEvent = true;
            actualPublishData.push(this.data);
            this.emit(EVENTS.REJECT);
          }
          if (this.data.nature.type === 'execution' &&
              this.data.nature.quality === 'cancelation') {
            actualCancelationCalledCount++;
            actualPublishCancelationData.push(this.data);
            this.emit(EVENTS.DONE);
          }
        });

        contextData.on(EVENTS.DONE, () => {
          expect(actualCalledCount).eql(execution.instances.length);
          expect(actualPublishData).eql(expectedPublishContexts);

          expect(actualCancelationCalledCount).eql(execution.instances.length);
          expect(actualPublishCancelationData).eql(expectedPublishCancelationContexts);
          done();
        });
        jobManagerCancellation.process(contextData);
      });
    });
    describe('done', () => {
      it('should run process correctly', (done) => {
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

        const expectedPublishContexts = execution.instances.map((instance) => {
          const returnVal = {
            id: `${contextData.data.id}-${execution.scenario.id}`,
            payload: {
              queue: instance.hostname,
              message: execution,
            },
            nature: contextData.data.nature,
          };
          return returnVal;
        });

        let actualCalledCount = 0;
        const actualPublishData = [];
        sandbox.stub(ContextMock.prototype, 'publish', function publish() {
          if (this.data.payload.queue) {
            actualCalledCount++;
            this.emitedEvent = true;
            actualPublishData.push(this.data);
            this.emit(EVENTS.DONE);
          }
        });

        contextData.on(EVENTS.DONE, () => {
          expect(actualPublishData).eql(expectedPublishContexts);
          expect(actualCalledCount).eql(execution.instances.length);

          done();
        });
        jobManagerCancellation.process(contextData);
      });
    });
  });

  describe('ExecutionObject', () => {
    describe('reject', () => {
      it('should run process correctly', (done) => {
        const execution = executionsResources.completedExecution;
        execution.instances = [
          { hostname: 'hostname1' },
          { hostname: 'hostname2' },
          { hostname: 'hostname3' },
        ];

        const contextData = new ContextMock(cementHelperMock, {
          id: '1111111111',
          payload: { execution },
          nature: {
            type: 'testtype',
            quality: 'testquality',
          },
        });

        const expectedPublishContexts = execution.instances.map((instance) => {
          const returnVal = {
            id: `${contextData.data.id}-${execution.scenario.id}`,
            payload: {
              queue: instance.hostname,
              message: execution,
            },
            nature: contextData.data.nature,
          };
          return returnVal;
        });

        const expectedPublishCancelationContexts = execution.instances.map(() => {
          const returnVal = {
            id: '',
            payload: {
              jobid: '',
            },
            nature: {
              type: 'execution',
              quality: 'cancelation',
            },
          };
          return returnVal;
        });

        let actualCalledCount = 0;
        const actualPublishData = [];
        let actualCancelationCalledCount = 0;
        const actualPublishCancelationData = [];
        sandbox.stub(ContextMock.prototype, 'publish', function publish() {
          if (this.data.payload.queue) {
            actualCalledCount++;
            this.emitedEvent = true;
            actualPublishData.push(this.data);
            this.emit(EVENTS.REJECT);
          }
          if (this.data.nature.type === 'execution' &&
              this.data.nature.quality === 'cancelation') {
            actualCancelationCalledCount++;
            actualPublishCancelationData.push(this.data);
            this.emit(EVENTS.DONE);
          }
        });

        contextData.on(EVENTS.DONE, () => {
          expect(actualCalledCount).eql(execution.instances.length);
          expect(actualPublishData).eql(expectedPublishContexts);

          expect(actualCancelationCalledCount).eql(execution.instances.length);
          expect(actualPublishCancelationData).eql(expectedPublishCancelationContexts);
          done();
        });
        jobManagerCancellation.process(contextData);
      });
    });
    describe('done', () => {
      it('should run process correctly', (done) => {
        const execution = executionsResources.completedExecution;
        execution.instances = [
          { hostname: 'hostname1' },
          { hostname: 'hostname2' },
          { hostname: 'hostname3' },
        ];

        const contextData = new ContextMock(cementHelperMock, {
          id: '111111111',
          payload: { execution },
          nature: {
            type: 'testtype',
            quality: 'testquality',
          },
        });

        const expectedPublishContexts = execution.instances.map((instance) => {
          const returnVal = {
            id: `${contextData.data.id}-${execution.scenario.id}`,
            payload: {
              queue: instance.hostname,
              message: execution,
            },
            nature: contextData.data.nature,
          };
          return returnVal;
        });

        let actualCalledCount = 0;
        const actualPublishData = [];
        sandbox.stub(ContextMock.prototype, 'publish', function publish() {
          if (this.data.payload.queue) {
            actualCalledCount++;
            this.emitedEvent = true;
            actualPublishData.push(this.data);
            this.emit(EVENTS.DONE);
          }
        });

        contextData.on(EVENTS.DONE, () => {
          expect(actualPublishData).eql(expectedPublishContexts);
          expect(actualCalledCount).eql(execution.instances.length);

          done();
        });
        jobManagerCancellation.process(contextData);
      });
    });
  });
});
