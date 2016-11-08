'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');

const Logger = require('cta-logger');
const Helper = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/base/', 'basehelper.js'));

const DEFAULTCONFIG = require('./index.config.testdata.js');
const DEFAULTLOGGER = new Logger(null, null, DEFAULTCONFIG.name);
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: DEFAULTCONFIG.name,
  dependencies: {
    logger: DEFAULTLOGGER,
  },
};

describe('BusinessLogics - Base Helper - constructor', function() {
  context('when everything ok', function() {
    let helper;
    before(function() {
      helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
    });
    it('should return a handler instance', function() {
      expect(helper).to.be.an.instanceof(Helper);
    });
    it('should have cementHelper property', function() {
      expect(helper).to.have.property('cementHelper', DEFAULTCEMENTHELPER);
    });
  });

  context('when missing \'cementHelper\' argument', function() {
    it('should throw an Error', function() {
      return expect(function() {
        return new Helper(null, DEFAULTLOGGER);
      }).to.throw(Error, 'missing/incorrect \'cementHelper\' CementHelper argument');
    });
  });

  context('when missing \'logger\' argument', function() {
    it('should throw an Error', function() {
      return expect(function() {
        return new Helper(DEFAULTCEMENTHELPER, null);
      }).to.throw(Error, 'missing/incorrect \'logger\' Logger argument');
    });
  });
});
