'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const expect = chai.expect;
const nodepath = require('path');

const Brick = require('cta-brick');
const Logger = require('cta-logger');
const Logic = require(nodepath.join(appRootPath,
  '/lib/bricks/businesslogics/base/', 'index.js'));

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

describe('BusinessLogics - Base - constructor', function() {
  context('when everything ok', function() {
    let logic;
    before(function() {
      logic = new Logic(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    after(function() {
    });

    it('should extend Brick', function() {
      expect(Object.getPrototypeOf(Logic)).to.equal(Brick);
    });

    it('should return a Logic object', function() {
      expect(logic).to.be.an.instanceof(Logic);
      expect(logic).to.have.property('helpers').and.to.be.a('Map');
    });
  });
});
