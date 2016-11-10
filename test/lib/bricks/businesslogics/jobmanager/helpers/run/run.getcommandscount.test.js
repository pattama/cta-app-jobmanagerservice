'use strict';

const chai = require('chai');
const expect = chai.expect;

const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - getCommandsCount', function() {

  const helper = BusinessLogicsUtils.createHelper('run.js');
  const instancesCount = 2;
  const testsCount = 5;

  context('when everything ok', function() {

    context('when it is MONO mode', function() {
      it('should returns 1', function() {
        const commandsCount = helper.getCommandsCount('mono', instancesCount, testsCount);
        expect(commandsCount, 1);
      });
    });

    context('when it is STRESS mode', function() {
      it('should returns instancesCount', function() {
        const commandsCount = helper.getCommandsCount('stress', instancesCount, testsCount);
        expect(commandsCount, instancesCount);
      });
    });

    context('when it is GROUP mode', function() {
      it('should returns 1', function() {
        const commandsCount = helper.getCommandsCount('group', instancesCount, testsCount);
        expect(commandsCount, 1);
      });
    });

    context('when it is PARALLEL mode', function() {
      it('should returns testsCount', function() {
        const commandsCount = helper.getCommandsCount('parallel', instancesCount, testsCount);
        expect(commandsCount, testsCount);
      });
    });
  });

});
