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

const EVENTS = require('../../../../lib/enum/events');

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

  it('should run process correctly', (done) => {
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
    ].map((instance) => instance.toJSON());

    const updateInstance = responseInstances[0];

    const completedExecutionWithInstance = JSON.parse(JSON.stringify(responseExecution));
    completedExecutionWithInstance.instances = [responseInstances[0]];


    mockExecutionRest
      .expects('createExecution')
      .withArgs(createdExecution)
      .once()
      .resolves(responseExecution);

    mockExecutionRest
      .expects('updateExecution')
      .withArgs(responseExecution.id, { instances: [updateInstance] })
      .once()
      .resolves(completedExecutionWithInstance);

    mockInstancesRest
      .expects('getMatchingInstances')
      .withArgs(matchingInstanceData)
      .once()
      .resolves(responseInstances);


    const contextData = new ContextMock(cementHelperMock, {
      payload: { scenario, user },
      nature: {
        type: 'execution',
        quality: 'creation',
      },
    });

    const expectedContextResp = {
      id: responseExecution.id,
      message: {
        id: responseExecution.id,
        nature: contextData.data.nature,
        payload: completedExecutionWithInstance,
      },
      queue: completedExecutionWithInstance.instances[0].hostname,
      nature: contextData.data.nature,
    };

    let expectedPublishData;
    let expectedCalledCount = 0;

    ContextMock.prototype.publish = function publish() {
      expectedCalledCount++;
      if (!this.emitedEvent) {
        this.emitedEvent = true;
        expectedPublishData = this.data;
        this.emit(EVENTS.DONE);
      }
    };

    contextData.on(EVENTS.DONE, () => {
      expect(expectedPublishData).deep.equals(expectedContextResp);
      expect(expectedCalledCount).equal(1);

      done();
    });

    jobManagerCreation.process(contextData);
  });

  it('should run process correctly and emit reject events', (done) => {
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
    ].map((instance) => instance.toJSON());

    const updateInstance = responseInstances[0];

    const completedExecutionWithInstance = JSON.parse(JSON.stringify(responseExecution));
    completedExecutionWithInstance.instances = [responseInstances[0]];


    mockExecutionRest
      .expects('createExecution')
      .withArgs(createdExecution)
      .once()
      .resolves(responseExecution);

    mockExecutionRest
      .expects('updateExecution')
      .withArgs(responseExecution.id, { instances: [updateInstance] })
      .once()
      .resolves(completedExecutionWithInstance);

    mockInstancesRest
      .expects('getMatchingInstances')
      .withArgs(matchingInstanceData)
      .once()
      .resolves(responseInstances);


    const contextData = new ContextMock(cementHelperMock, {
      payload: { scenario, user },
      nature: {
        type: 'execution',
        quality: 'creation',
      },
    });

    const expectedContextResp = {
      id: responseExecution.id,
      message: {
        id: responseExecution.id,
        nature: contextData.data.nature,
        payload: completedExecutionWithInstance,
      },
      queue: completedExecutionWithInstance.instances[0].hostname,
      nature: contextData.data.nature,
    };

    let expectedPublishData;
    let expectedCalledCount = 0;

    ContextMock.prototype.publish = function publish() {
      expectedCalledCount++;
      if (!this.emitedEvent) {
        this.emitedEvent = true;
        expectedPublishData = this.data;
        this.emit(EVENTS.REJECT);
      }
    };

    contextData.on(EVENTS.REJECT, () => {
      expect(expectedPublishData).deep.equals(expectedContextResp);
      expect(expectedCalledCount).equal(1);

      done();
    });

    jobManagerCreation.process(contextData);
  });
});
