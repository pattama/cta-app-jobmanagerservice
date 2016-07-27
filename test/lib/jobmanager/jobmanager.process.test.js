'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

require('sinon-as-promised');

const executionRest = require('../../../lib/execution');
const instancesRest = require('../../../lib/instances');

const EventEmitter = require('events');

const JobManager = require('../../../lib');

class MockContext extends EventEmitter {
  constructor(context) {
    super();
    this.data = context.data;
  }
}

describe('JobManager.process', () => {
  let jobManager;
  let sandbox;
  let mockExecutionRest;
  let mockInstancesRest;

  beforeEach(() => {
    jobManager = new JobManager({}, { name: 'mock' });
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

    const responseInstances = ['instance1', 'instance2', 'instance3'];

    mockExecutionRest
      .expects('sendPostRequest')
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
      .expects('sendPostRequest')
      .withArgs(completedExecution)
      .once()
      .resolves(completedExecution);

    const contextData = new MockContext({
      data: {
        payload: scenarioData,
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      },
    });

    contextData.on('done', (name, result) => {
      expect(name).equal('mock');
      expect(result).eql(completedExecution);
      done();
    });
    jobManager.process(contextData);
  });
});
