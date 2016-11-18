'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const path = require('path');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const configHelperPath = path.join(BusinessLogicsUtils.HelperPath, '/helpers/config_helper.js');
const configHelper = require(configHelperPath);

describe('BusinessLogics - JobManager - config_helper - getInstancesUrl', () => {
  context('when everything is ok', () => {
    it('should returns instancesUrl', () => {
      const config = {
        instancesUrl: 'instances-data-services.com',
      };
      configHelper.setConfig(config);
      const url = configHelper.getInstancesUrl();
      expect(url).equal('instances-data-services.com');
    });

    it('should returns executionsUrl without ending slash', () => {
      const config = {
        instancesUrl: 'instances-data-services.com/',
      };
      configHelper.setConfig(config);
      const url = configHelper.getInstancesUrl();
      expect(url).equal('instances-data-services.com');
    });
  });
});
