'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const _ = require('lodash');

const BusinessLogicsUtils = require('../../../utils/businesslogics');
const inputJob = require('./run.sample.testdata.js');

describe('BusinessLogics - Execution - Run - sendDirectComandToInstances', () => {
  const scenario = inputJob.payload.scenario;
  const configuration = inputJob.payload.configuration;
  const execution = {
    id: '1234567890',
    commandsCount: 1,
    instances: [
      { hostname: 'machine1' },
      { hostname: 'machine2' },
    ],
  };

  let sandbox;
  let helper;
  let stubMessengerSendOneMessageToOneQueue;
  let stubMessengerSendOneMessageToManyQueues;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubMessengerSendOneMessageToOneQueue = sandbox.stub(helper.messenger,
      'sendOneMessageToOneQueue');
    stubMessengerSendOneMessageToManyQueues = sandbox.stub(helper.messenger,
      'sendOneMessageToManyQueues');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', () => {
    context('when it is MONO mode', () => {
      it('should call sendOneMessageToOneQueue method', () => {
        stubMessengerSendOneMessageToOneQueue.resolves();

        const promise = helper.sendDirectCommandToInstances(scenario, configuration, execution);
        return promise.then(() => {
          const runMessage = helper.getRunMessage(execution, scenario.testSuite);
          sinon.assert.calledWith(stubMessengerSendOneMessageToOneQueue,
            runMessage, 'cta.machine1');
        });
      });
    });

    context('when it is STRESS mode', () => {
      it('should call sendOneMessageToManyQueues method', () => {
        stubMessengerSendOneMessageToManyQueues.resolves();
        const configurationStress = _.cloneDeep(configuration);
        configurationStress.runMode = 'stress';

        const promise = helper.sendDirectCommandToInstances(scenario,
          configurationStress, execution);
        return promise.then(() => {
          const runMessage = helper.getRunMessage(execution, scenario.testSuite);
          sinon.assert.calledWith(stubMessengerSendOneMessageToManyQueues,
            runMessage, ['cta.machine1', 'cta.machine2']);
        });
      });
    });
  });
});
