'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

require('sinon-as-promised');

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const executionRest = require('../../../../lib/httprequest/executions');
const instancesRest = require('../../../../lib/httprequest/instances');

const Instance = require('../../../../lib/objects/instance');

const JobManagerCreation = require('../../../../lib/bricks/jobmanager_creation');

const cementHelperMock = new CementHelperMock();

describe('JobManagerCreation.process', () => {
  let jobManagerCreation;
  let sandbox;
  let mockExecutionRest;
  let mockInstancesRest;

  beforeEach(() => {
    jobManagerCreation = new JobManagerCreation(cementHelperMock, { name: 'mock' });
    sandbox = sinon.sandbox.create();

    mockExecutionRest = sandbox.mock(executionRest);
    mockInstancesRest = sandbox.mock(instancesRest);
  });

  afterEach(() => {
    mockExecutionRest.verify();
    mockInstancesRest.verify();

    sandbox.restore();
  });

  it('should run process correctly', () => {
    const scenarioData = {
      id: '1111111111',
      name: 'testScenario',
      description: 'Test scenario',
      scopetested: '',
      testsuites: [
        {
          id: '1231231232',
          name: 'testTestSuite',
          applicationtested: '',
          parent: '',
        },
      ],
      configuration: {
        id: '1232131232',
        name: 'testConfig',
        targetmode: '',
        runmode: 'mono',
        type: 'physical',
        properties: [
          {
            name: 'testname',
            value: 'testvalue',
          },
        ],
      },
      pendingtimeout: 1000,
      runningtimeout: 1000,
      scheduled: true,
    };

    const createdExecution = {
      scenario: scenarioData.id,
      configuration: scenarioData.configuration,
    };

    const responseExecution = {
      id: '2222222222',
      scenario: '1111111111',
      configuration: {
        id: '1232131232',
        name: 'testConfig',
        targetmode: '',
        runmode: 'mono',
        type: 'physical',
        properties: [
          {
            name: 'testname',
            value: 'testvalue',
          },
        ],
      },
      user: '3333333333',
      starttimestamp: 1213,
      updatetimestamp: 1214,
      state: 'pending',
      status: 'succeeded',
      ok: 1,
      partial: 1,
      inconclusive: 1,
      failed: 1,
      nbstatuses: 4,
      done: true,
    };

    const matchingData = {
      type: scenarioData.configuration.type,
      properties: scenarioData.configuration.properties,
    };

    const responseInstances = [
      new Instance({ hostname: 'instance1' }),
      new Instance({ hostname: 'instance2' }),
      new Instance({ hostname: 'instance3' }),
    ];

    mockExecutionRest
      .expects('upsertExecutions')
      .withArgs(createdExecution)
      .once()
      .resolves(responseExecution);

    mockInstancesRest
      .expects('getMatchingInstances')
      .withArgs(matchingData)
      .once()
      .resolves(responseInstances);

    const completedExecution = JSON.parse(JSON.stringify(responseExecution));
    completedExecution.instances = [responseInstances[0]];

    mockExecutionRest
      .expects('upsertExecutions')
      .withArgs(completedExecution)
      .once()
      .resolves(completedExecution);

    const contextData = new ContextMock(cementHelperMock, {
      payload: scenarioData,
      nature: {
        type: 'testtype',
        quality: 'testquality',
      },
    });

    const publishSpy = sandbox.spy(jobManagerCreation.context, 'publish');

    return expect(jobManagerCreation.process(contextData))
      .to.be.fulfilled.and.then(() => {
        expect(jobManagerCreation.context.data).eql({
          payload: {
            queue: completedExecution.instances[0].hostname,
            message: completedExecution,
          },
        });
        expect(publishSpy.calledOnce).eql(true);
      });
  });
});
