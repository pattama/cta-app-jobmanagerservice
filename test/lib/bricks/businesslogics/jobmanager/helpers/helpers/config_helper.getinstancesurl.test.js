'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const mock = require('mock-require');

const path = require('path');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const configHelperPath = path.join(BusinessLogicsUtils.HelperPath, '/helpers/config_helper.js');

describe('BusinessLogics - JobManager - config_helper - getInstancesUrl', function() {

  const configHelper = require(configHelperPath);

  context('when everything is ok', function () {

    it('should returns instancesUrl', function () {
      const config = {
        instancesUrl: 'instances-data-services.com'
      };
      configHelper.setConfig(config);
      const url = configHelper.getInstancesUrl();
      expect(url).equal('instances-data-services.com');
    });

    it('should returns executionsUrl without ending slash', function () {
      const config = {
        instancesUrl: 'instances-data-services.com/'
      };
      configHelper.setConfig(config);
      const url = configHelper.getInstancesUrl();
      expect(url).equal('instances-data-services.com');
    });
  });
});
