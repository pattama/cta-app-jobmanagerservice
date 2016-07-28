'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

// const config = require('../../../config');
const configHelper = require('../../../lib/helpers/config_helper');

describe('configHelper', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('getExecutionsUrl', () => {
    it('should get execution url from config', () => {
      const executionsUrl = 'http://example.com/executions';
      const testConfig = { executionsUrl };
      configHelper.setConfig(testConfig);

      expect(configHelper.getExecutionsUrl()).equal(testConfig.executionsUrl);
    });
  });

  describe('getInstancesUrl', () => {
    it('should get instance url from config', () => {
      const instancesUrl = 'http://example.com/instances';
      const testConfig = { instancesUrl };
      configHelper.setConfig(testConfig);

      expect(configHelper.getInstancesUrl()).equal(testConfig.instancesUrl);
    });
  });
});
