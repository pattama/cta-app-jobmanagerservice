'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const _ = require('lodash');

const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - sendDirectComandToInstances', function() {

  const inputJob = require('./run.sample.testdata.js');
  const scenario = inputJob.payload.scenario;
  const configuration = inputJob.payload.configuration;
  const execution = {
    id: '1234567890',
    commandsCount: 1,
    instances: [
      { hostname: 'machine1' },
      { hostname: 'machine2' }
    ]
  };

  let sandbox;
  let helper;
  let stubMessengerSendOneMessageToOneQueue;
  let stubMessengerSendOneMessageToManyQueues;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubMessengerSendOneMessageToOneQueue = sandbox.stub(helper.messenger, 'sendOneMessageToOneQueue');
    stubMessengerSendOneMessageToManyQueues = sandbox.stub(helper.messenger, 'sendOneMessageToManyQueues');

  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', function() {

    context('when it is MONO mode', function() {

      it('should call sendOneMessageToOneQueue method', function() {
        stubMessengerSendOneMessageToOneQueue.resolves();

        const promise = helper.sendDirectCommandToInstances(scenario, configuration, execution);
        return promise.then(() => {
          const runMessage = helper.getRunMessage(execution, scenario.testSuite)
          sinon.assert.calledWith(stubMessengerSendOneMessageToOneQueue,
            runMessage, 'cta.machine1');
        });

      });

    });

    context('when it is STRESS mode', function() {

      it('should call sendOneMessageToManyQueues method', function() {
        stubMessengerSendOneMessageToManyQueues.resolves();
        const _configuration = _.cloneDeep(configuration);
        _configuration.runMode = 'stress';

        const promise = helper.sendDirectCommandToInstances(scenario, _configuration, execution);
        return promise.then(() => {
          const runMessage = helper.getRunMessage(execution, scenario.testSuite)
          sinon.assert.calledWith(stubMessengerSendOneMessageToManyQueues,
            runMessage, ['cta.machine1', 'cta.machine2']);
        });

      });

    });
  });

});
