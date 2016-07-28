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

      expect(configHelper.getExecutionsUrl()).equal(executionsUrl);
    });
    it('should get execution url from config without / behind', () => {
      const executionsUrl = 'http://example.com/executions';
      const executionsUrlWithSlash = `${executionsUrl}/`;
      const testConfig = { executionsUrl: executionsUrlWithSlash };
      configHelper.setConfig(testConfig);

      expect(configHelper.getExecutionsUrl()).equal(executionsUrl);
    });
  });

  describe('getInstancesUrl', () => {
    it('should get instances url from config', () => {
      const instancesUrl = 'http://example.com/instances';
      const testConfig = { instancesUrl };
      configHelper.setConfig(testConfig);

      expect(configHelper.getInstancesUrl()).equal(instancesUrl);
    });
    it('should get instances url from config without / behind', () => {
      const instancesUrl = 'http://example.com/instances';
      const instancesUrlWithSlash = `${instancesUrl}/`;
      const testConfig = { instancesUrl: instancesUrlWithSlash };
      configHelper.setConfig(testConfig);

      expect(configHelper.getInstancesUrl()).equal(instancesUrl);
    });
  });
});
