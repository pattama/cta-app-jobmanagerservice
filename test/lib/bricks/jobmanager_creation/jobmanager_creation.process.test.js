'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

require('sinon-as-promised');

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const scenarioResources = require('../../../resources/scenarios');
const executionsResources = require('../../../resources/executions');
const usersResources = require('../../../resources/users');

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
    const scenario = scenarioResources.completedScenario;
    const responseExecution = executionsResources.completedExecution;
    const user = usersResources.completedUser;

    const createdExecution = { scenario, user };

    const matchingInstanceData = {
      type: scenario.configuration.type,
      properties: scenario.configuration.properties,
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
      .withArgs(matchingInstanceData)
      .once()
      .resolves(responseInstances);

    const completedExecutionWithInstance = JSON.parse(JSON.stringify(responseExecution));
    completedExecutionWithInstance.instances = [responseInstances[0]];

    mockExecutionRest
      .expects('upsertExecutions')
      .withArgs(completedExecutionWithInstance)
      .once()
      .resolves(completedExecutionWithInstance);

    const contextData = new ContextMock(cementHelperMock, {
      payload: { scenario, user },
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
            queue: completedExecutionWithInstance.instances[0].hostname,
            message: completedExecutionWithInstance,
          },
        });
        expect(publishSpy.calledOnce).eql(true);
      });
  });
});
