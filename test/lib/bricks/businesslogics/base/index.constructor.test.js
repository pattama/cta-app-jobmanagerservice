'use strict';

const appRootPath = require('cta-common').root('cta-jobmanager');
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

describe('BusinessLogics - Base - constructor', () => {
  context('when everything ok', () => {
    let logic;
    before(() => {
      logic = new Logic(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    after(() => {
    });

    it('should extend Brick', () => {
      expect(Object.getPrototypeOf(Logic)).to.equal(Brick);
    });

    it('should return a Logic object', () => {
      expect(logic).to.be.an.instanceof(Logic);
      expect(logic).to.have.property('helpers').and.to.be.a('Map');
    });
  });
});
