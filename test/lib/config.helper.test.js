const expect = require('chai').expect;
const sinon = require('sinon');

const config = require('../../config');
const configHelper = require('../../lib/config.helper');

describe('config.helper', () => {
  describe('isCreate', () => {
    const isCreate = configHelper.isCreate;
    it('should return true', () => {
      const sandbox = sinon.sandbox.create();

      sandbox.stub(config, 'create', {
        type: 'createType',
        quality: 'createQuality',
      });

      expect(isCreate({
        data: {
          nature: {
            type: 'createType',
            quality: 'createQuality',
          },
          payload: {},
        },
      })).equal(true);

      sandbox.restore();
    });
  });
  describe('isStop', () => {
    const isStop = configHelper.isStop;
    it('should return true', () => {
      const sandbox = sinon.sandbox.create();

      sandbox.stub(config, 'stop', {
        type: 'stopType',
        quality: 'stopQuality',
      });

      expect(isStop({
        data: {
          nature: {
            type: 'stopType',
            quality: 'stopQuality',
          },
          payload: {},
        },
      })).equal(true);

      sandbox.restore();
    });
  });

  describe('getExecutionUrl', () => {
    const getExecutionUrl = configHelper.getExecutionUrl;
    it('should get execution url from config', () => {
      const sandbox = sinon.sandbox.create();
      const executionUrl = 'http://example.com/execution';

      sandbox.stub(config, 'executionurl', executionUrl);
      expect(getExecutionUrl()).equal(config.executionurl);
    });
  });
});
