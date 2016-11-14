'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const mock = require('mock-require');

const path = require('path');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const configHelperPath = path.join(BusinessLogicsUtils.HelperPath, '/helpers/config_helper.js');

describe('BusinessLogics - JobManager - config_helper - getExecutionsUrl', function() {

  const configHelper = require(configHelperPath);

  context('when everything is ok', function () {

    it('should returns executionsUrl', function () {
      const config = {
        executionsUrl: 'executions-data-services.com'
      };
      configHelper.setConfig(config);
      const url = configHelper.getExecutionsUrl();
      expect(url).equal('executions-data-services.com');
    });

    it('should returns executionsUrl without ending slash', function () {
      const config = {
        executionsUrl: 'executions-data-services.com/'
      };
      configHelper.setConfig(config);
      const url = configHelper.getExecutionsUrl();
      expect(url).equal('executions-data-services.com');
    });
  });
});
