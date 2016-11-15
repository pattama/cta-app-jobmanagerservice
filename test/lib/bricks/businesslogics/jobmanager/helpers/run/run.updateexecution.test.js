'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const FlowControlUtils = require('../../../utils/flowcontrol');
const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - updateExecution', function() {

  const inputJob = require('./run.sample.testdata.js');

  let sandbox;
  let helper;
  let stubRestUpdateExecution;
  let stubGetCommandsCount;
  let contextInputMock;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helper = BusinessLogicsUtils.createHelper('run.js');
    stubRestUpdateExecution = sandbox.stub(helper.executionRequest, 'updateExecution');
    stubGetCommandsCount = sandbox.stub(helper, 'getCommandsCount')

    contextInputMock = FlowControlUtils.createContext(inputJob);
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everything ok', function() {

    it('should resolve execution', function() {
      const execution = {
        id: '1234567890'
      };
      const instances = [
        { hostname: 'machine1' },
        { hostname: 'machine2' }
      ];
      const commandsCount = 2;
      stubRestUpdateExecution.resolves();
      stubGetCommandsCount.returns(commandsCount);

      const promise = helper.updateExecution(contextInputMock, execution, instances);
      return promise.then(() => {
        sinon.assert.calledWith(stubRestUpdateExecution, execution.id, {
          instances, commandsCount
        });
      });

    });

  });

});
