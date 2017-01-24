'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const path = require('path');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const configHelperPath = path.join(BusinessLogicsUtils.HelperPath, '/helpers/config_helper.js');
const configHelper = require(configHelperPath);

describe('BusinessLogics - JobManager - config_helper - getExecutionsUrl', () => {
  context('when everything is ok', () => {
    it('should returns executionsUrl', () => {
      const config = {
        executionsUrl: 'executions-data-services.com',
      };
      configHelper.setConfig(config);
      const url = configHelper.getExecutionsUrl();
      expect(url).equal('executions-data-services.com');
    });
  });
});
