'use strict';

const chai = require('chai');
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const CementHelperMock = require('../../../mocks/cementHelper');
const ContextMock = require('../../../mocks/context');

const scenarioResources = require('../../../resources/scenarios');
const userResources = require('../../../resources/users');

const JobManagerDrop = require('../../../../lib/bricks/businesslogics/jobmanager/helpers/jobmanager_drop');

describe('JobManagerDrop.validate', () => {
  let jobManager;
  const cementHelperMock = new CementHelperMock();

  beforeEach(() => {
    jobManager = new JobManagerDrop(cementHelperMock, {
      name: 'mock',
      properties: {
        provider: {
          name: 'rabbitmq',
          options: {},
        },
      },
      queue: '',
    });
  });

  it('should have correct properties', (done) => {
    const scenario = scenarioResources.completedScenario;
    const user = userResources.completedUser;

    const contextData = new ContextMock(cementHelperMock, {
      payload: { scenario, user },
      nature: {
        type: 'message',
        quality: 'drop',
      },
    });

    expect(jobManager.validate(contextData))
      .to.be.fulfilled.and.notify(done);
  });

  describe('Errors', () => {
    it('should reject if nature has incorrect type and quality', () => {
      const scenario = scenarioResources.completedScenario;

      const contextData = new ContextMock(cementHelperMock, {
        payload: { scenario },
        nature: {
          type: 'invalidtype',
          quality: 'invalidquality',
        },
      });

      return expect(jobManager.validate(contextData))
        .to.be.rejected.and.then((reason) => {
          expect(reason instanceof Error).equal(true);
          expect(reason.message).equal('type must be message and quality must be drop');
        });
    });
  });
});
