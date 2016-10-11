'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const scenarioResources = require('../../../resources/scenarios');
const userResources = require('../../../resources/users');

const JobManagerCreation = require('../../../../lib/bricks/businesslogics/jobmanager/helpers/jobmanager_creation');

describe('JobManagerCreation.validate', () => {
  let jobManager;
  const cementHelperMock = new CementHelperMock();

  before(() => {
    jobManager = new JobManagerCreation(cementHelperMock, { name: 'mock' });
  });

  it('should have correct properties', (done) => {
    const scenario = scenarioResources.completedScenario;
    const user = userResources.completedUser;

    const contextData = new ContextMock(cementHelperMock, {
      payload: { scenario, user },
      nature: {
        type: 'testtype',
        quality: 'testquality',
      },
    });

    expect(jobManager.validate(contextData))
      .to.be.fulfilled.and.notify(done);
  });

  describe('Errors', () => {
    it('should reject if payload does not have user field', () => {
      const scenario = scenarioResources.completedScenario;

      const contextData = new ContextMock(cementHelperMock, {
        payload: { scenario },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      return expect(jobManager.validate(contextData))
        .to.be.rejected.and.then((reason) => {
          expect(reason instanceof Error).equal(true);
          expect(reason.message).equal('user field is require');
        });
    });
    it('should reject if payload does not have scenario field', () => {
      const user = scenarioResources.completedUser;

      const contextData = new ContextMock(cementHelperMock, {
        payload: { user },
        nature: {
          type: 'testtype',
          quality: 'testquality',
        },
      });

      return expect(jobManager.validate(contextData))
        .to.be.rejected.and.then((reason) => {
          expect(reason instanceof Error).equal(true);
          expect(reason.message).equal('scenario field is require');
        });
    });
  });
});
