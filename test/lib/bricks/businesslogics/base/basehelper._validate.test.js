'use strict';

const appRootPath = require('cta-common').root('cta-jobmanager');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');

const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;
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
  createContext: () => {},
};

describe('BusinessLogics - Base Helper - _validate', () => {
  let helper;
  const DEFAULTINPUTJOB = {
    nature: {
      type: 'execution',
      quality: Helper.name.toLowerCase(),
    },
    payload: {},
  };
  before(() => {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
  });
  context('when everything ok', () => {
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, DEFAULTINPUTJOB);
    let promise;
    before(() => {
      promise = helper._validate(mockInputContext);
    });
    after(() => {
    });
    it('should resolve', () => {
      expect(promise).to.eventually.have.property('ok', 1);
    });
  });
});
