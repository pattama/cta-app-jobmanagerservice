'use strict';

const appRootPath = require('app-root-path').path;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const nodepath = require('path');
const _ = require('lodash');

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

describe('BusinessLogics - Base - process', function() {
  const helperName = 'helperone';
  const JOB = {
    nature: {
      type: Logic.name.toLowerCase(),
      quality: helperName,
    },
    payload: {},
  };
  let logic;
  before(function () {
    // create some mock helpers
    const MockHelper = function (cementHelper) {
      return {
        ok: '1',
        cementHelper: cementHelper,
        _validate: function () {
        },
        _process: function () {
        },
      };
    };
    logic = new Logic(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    logic.helpers.set(helperName, new MockHelper(logic.cementHelper, logic.logger));
  });

  after(function () {
  });

  context('when everything ok', function () {
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    let result;
    before(function () {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(logic.helpers.get(helperName), '_process').withArgs(context).returns(true);
      result = logic.process(context);
    });
    after(function () {
      Brick.prototype.validate.restore();
      logic.helpers.get(helperName)._process.restore();
    });

    it('should return provider _validate() result', function () {
      return expect(result).to.be.equal(
        logic.helpers.get(helperName)._process.returnValues[0]
      );
    });
  });
});
