'use strict';

const chai = require('chai');
const expect = chai.expect;

const BusinessLogicsUtils = require('../../../utils/businesslogics');

describe('BusinessLogics - Execution - Run - getCommandsCount', () => {
  const helper = BusinessLogicsUtils.createHelper('run.js');
  const instancesCount = 2;
  const testsCount = 5;

  context('when everything ok', () => {
    context('when it is MONO mode', () => {
      it('should returns 1', () => {
        const commandsCount = helper.getCommandsCount('mono', instancesCount, testsCount);
        expect(commandsCount, 1);
      });
    });

    context('when it is STRESS mode', () => {
      it('should returns instancesCount', () => {
        const commandsCount = helper.getCommandsCount('stress', instancesCount, testsCount);
        expect(commandsCount, instancesCount);
      });
    });

    context('when it is GROUP mode', () => {
      it('should returns 1', () => {
        const commandsCount = helper.getCommandsCount('group', instancesCount, testsCount);
        expect(commandsCount, 1);
      });
    });

    context('when it is PARALLEL mode', () => {
      it('should returns testsCount', () => {
        const commandsCount = helper.getCommandsCount('parallel', instancesCount, testsCount);
        expect(commandsCount, testsCount);
      });
    });
  });
});
