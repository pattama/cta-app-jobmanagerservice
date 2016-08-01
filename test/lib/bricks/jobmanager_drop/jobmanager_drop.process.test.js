'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

require('sinon-as-promised');

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const executionsResources = require('../../../resources/executions');
const commandLineJobResources = require('../../../resources/commandlinejob');

const JobManagerDrop = require('../../../../lib/bricks/jobmanager_drop');

const EVENTS = require('../../../../lib/enum/events');

const cementHelperMock = new CementHelperMock();

describe('JobManagerDrop.process', () => {
  let jobManagerDrop;
  let sandbox;

  beforeEach(() => {
    jobManagerDrop = new JobManagerDrop(cementHelperMock, { name: 'mock' });
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.verify();
    sandbox.restore();
  });

  describe('Consumed', () => {
    it('should run process correctly', (done) => {
      const execution = executionsResources.completedExecution;
      const commandlineJob = commandLineJobResources.commandlineJob;
      let idCounter = 1;

      sandbox.stub(jobManagerDrop.messaging, 'consume', (input) => {
        const response = JSON.parse(JSON.stringify(commandlineJob));
        response.id = `${idCounter}`;
        idCounter++;
        setTimeout(() => {
          input.cb(response);
        }, 10);
        return Promise.resolve();
      });

      sandbox.mock(jobManagerDrop.messaging)
        .expects('produce')
        .twice()
        .resolves();

      const contextData = new ContextMock(cementHelperMock, {
        id: '3',
        payload: {
          queue: 'testqueue',
          execution,
        },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      jobManagerDrop.context.on(EVENTS.DONE, (data) => {
        const expectedCommandlineJob = JSON.parse(JSON.stringify(commandlineJob));
        expectedCommandlineJob.id = '3';

        expect(data).eql(expectedCommandlineJob);

        done();
      });

      jobManagerDrop.process(contextData);
    });
  });

  describe('SendSystem', () => {
    it('should run process correctly', (done) => {
      const execution = executionsResources.completedExecution;

      sandbox.mock(jobManagerDrop.messaging)
        .expects('consume')
        .once()
        .rejects(new Error('Cannot consume'));

      const contextData = new ContextMock(cementHelperMock, {
        id: '',
        payload: {
          queue: 'testqueue',
          execution,
        },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      jobManagerDrop.context.on(EVENTS.REJECT, (data) => {
        expect(data).equal(true);

        done();
      });

      jobManagerDrop.process(contextData);
    });
  });
});
