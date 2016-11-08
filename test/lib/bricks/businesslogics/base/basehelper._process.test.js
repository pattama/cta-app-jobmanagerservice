'use strict';

const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
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
  createContext: function() {},
};

describe('BusinessLogics - Base Helper - _process', function() {
  let helper;
  before(function() {
    helper = new Helper(DEFAULTCEMENTHELPER, DEFAULTLOGGER);
  });
  context('when everything ok', function() {
    const inputJOB = {
      nature: {
        type: 'execution',
        quality: Helper.name.toLowerCase(),
      },
      payload: {},
    };
    const mockInputContext = new Context(DEFAULTCEMENTHELPER, inputJOB);
    before(function() {
      sinon.stub(mockInputContext, 'emit');
      helper._process(mockInputContext);
    });
    after(function() {
    });
    it('should emit done event on inputContext', function() {
      sinon.assert.calledWith(mockInputContext.emit, 'done', helper.cementHelper.brickName);
    });
  });
});
