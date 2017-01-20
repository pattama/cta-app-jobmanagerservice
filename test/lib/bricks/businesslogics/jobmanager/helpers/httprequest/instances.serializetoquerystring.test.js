'use strict';

const chai = require('chai');
const expect = chai.expect;

const path = require('path');
const BusinessLogicsUtils = require('../../../utils/businesslogics');
const instanceRequestPath = path.join(BusinessLogicsUtils.HelperPath, '/httprequest/instances');
const InstanceRequest = require(instanceRequestPath);


describe('BusinessLogics - JobManager - httprequest - serializeToQueryString', () => {

  context('when matchingData is nested object', () => {
    it('should resolves the HTTP body', () => {
      const matchingData = {
        properties: {
          os: 'Windows7',
          version: {
            major: 1,
            minor: 2,
          }
        }
      }
      const queryString = InstanceRequest.serializeToQueryString(matchingData);
      expect(queryString).equals('properties.os=Windows7&properties.version.major=1&properties.version.minor=2');
    });
  });

  context('when matchingData is array', () => {
    it('should resolves the HTTP body', () => {
      const matchingData = {
        properties: {
          softs: ['Chrome', 'NodeJS'],
        }
      }
      const queryString = InstanceRequest.serializeToQueryString(matchingData);
      expect(queryString).equals('properties.softs=Chrome,NodeJS');
    });
  });
});
