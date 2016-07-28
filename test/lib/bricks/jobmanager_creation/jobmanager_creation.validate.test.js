'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const scenarioResources = require('../../../resources/scenarios');

const JobManagerCreation = require('../../../../lib/bricks/jobmanager_creation');

describe('JobManagerCreation.validate', () => {
  let jobManager;
  const cementHelperMock = new CementHelperMock();

  before(() => {
    jobManager = new JobManagerCreation(cementHelperMock, { name: 'mock' });
  });

  it('should have correct properties', (done) => {
    const scenarioData = scenarioResources.completedScenario;

    const contextData = new ContextMock(cementHelperMock, {
      payload: scenarioData,
      nature: {
        type: 'testtype',
        quality: 'testquality',
      },
    });

    expect(jobManager.validate(contextData))
      .to.be.fulfilled.and.notify(done);
  });
});
