'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-as-promised'));

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const inputJob = require('./run.sample.testdata.js');

describe('BusinessLogics - Execution - Run - updateExecution', () => {
  let sandbox;
  let helper;
  let stubRestUpdateExecution;
  let stubGetCommandsCount;
  let contextInputMock;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubRestUpdateExecution = sandbox.stub(helper.executionRequest, 'updateExecution');
    stubGetCommandsCount = sandbox.stub(helper, 'getCommandsCount');

    contextInputMock = FlowControlUtils.createContext(inputJob);
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', () => {
    it('should resolve execution', () => {
      const execution = {
        id: '1234567890',
      };
      const instances = [
        { hostname: 'machine1' },
        { hostname: 'machine2' },
      ];
      const commandsCount = 2;
      stubRestUpdateExecution.resolves();
      stubGetCommandsCount.returns(commandsCount);

      const promise = helper.updateExecution(contextInputMock, execution, instances);
      return promise.then(() => {
        sinon.assert.calledWith(stubRestUpdateExecution, execution.id, {
          instances, commandsCount,
        });
      });
    });
  });
});
