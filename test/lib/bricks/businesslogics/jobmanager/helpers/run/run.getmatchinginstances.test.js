'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const _ = require('lodash')

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - getMatchingInstances', function() {

  const inputJob = require('./run.sample.testdata.js');
  const matchingInstances = [
    { hostname: 'machine1' },
    { hostname: 'machine2' }
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

  context('when instanceRest returns ok', function() {


    it('should resolve first matching instance in MONO mode', function() {
      const _inputJob = _.cloneDeep(inputJob);
      const contextInputMock = FlowControlUtils.createContext(_inputJob);

      stubRestGetMatchingInstances.resolves(matchingInstances);

      const promise = helper.getMatchingInstances(contextInputMock);
      return expect(promise).to.eventually.deep.equal([matchingInstances[0]]);

    });

    it('should resolve all matching instances in other modes', function() {
      const _inputJob = _.cloneDeep(inputJob);
      _inputJob.payload.configuration.runMode = 'stress';
      const inputContext = FlowControlUtils.createContext(_inputJob);

      stubRestGetMatchingInstances.resolves(matchingInstances);

      const promise = helper.getMatchingInstances(inputContext);
      return expect(promise).to.eventually.deep.equal(matchingInstances);

    });

  });

  context('when instanceRest returns ZERO matching instance', function() {

    it('should throws an error', function () {
      const _inputJob = _.cloneDeep(inputJob);
      const contextInputMock = FlowControlUtils.createContext(_inputJob);

      stubRestGetMatchingInstances.resolves([]);


      const promise = helper.getMatchingInstances(contextInputMock);
      return expect(promise).to.eventually.be.rejectedWith('No matching instances found')
        .then(() => {
          sinon.assert.calledWithMatch(stubLoggerError,
            'No matching instances found for configuration: ' + _inputJob.payload.configuration.id);
        });

    });
  });

});
