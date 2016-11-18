'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const _ = require('lodash');

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const inputJob = require('./run.sample.testdata.js');

describe('BusinessLogics - Execution - Run - getMatchingInstances', () => {
  const matchingInstances = [
    { hostname: 'machine1' },
    { hostname: 'machine2' },
  ];

  let sandbox;
  let helper;
  let stubRestGetMatchingInstances;
  let stubLoggerError;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubRestGetMatchingInstances = sandbox.stub(helper.instanceRequest, 'getMatchingInstances');
    stubLoggerError = sandbox.stub(helper.logger, 'error');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when instanceRest returns ok', () => {
    it('should resolve first matching instance in MONO mode', () => {
      const inputJobNormal = _.cloneDeep(inputJob);
      const contextInputMock = FlowControlUtils.createContext(inputJobNormal);

      stubRestGetMatchingInstances.resolves(matchingInstances);

      const promise = helper.getMatchingInstances(contextInputMock);
      return expect(promise).to.eventually.deep.equal([matchingInstances[0]]);
    });

    it('should resolve all matching instances in other modes', () => {
      const inputJobStress = _.cloneDeep(inputJob);
      inputJobStress.payload.configuration.runMode = 'stress';
      const inputContext = FlowControlUtils.createContext(inputJobStress);

      stubRestGetMatchingInstances.resolves(matchingInstances);

      const promise = helper.getMatchingInstances(inputContext);
      return expect(promise).to.eventually.deep.equal(matchingInstances);
    });
  });

  context('when instanceRest returns ZERO matching instance', () => {
    it('should throws an error', () => {
      const inputJobNormal = _.cloneDeep(inputJob);
      const contextInputMock = FlowControlUtils.createContext(inputJobNormal);

      stubRestGetMatchingInstances.resolves([]);


      const promise = helper.getMatchingInstances(contextInputMock);
      return expect(promise).to.eventually.be.rejectedWith('No matching instances found')
        .then(() => {
          const configurationId = inputJobNormal.payload.configuration.id;
          sinon.assert.calledWithMatch(stubLoggerError,
            `No matching instances found for configuration: ${configurationId}`);
        });
    });
  });
});
