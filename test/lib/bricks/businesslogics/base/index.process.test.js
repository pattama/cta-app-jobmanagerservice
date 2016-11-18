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

describe('BusinessLogics - Base - process', () => {
  const helperName = 'helperone';
  const JOB = {
    nature: {
      type: Logic.name.toLowerCase(),
      quality: helperName,
    },
    payload: {},
  };
  let logic;
  before(() => {
    // create some mock helpers
    const MockHelper = (cementHelper) => ({
      ok: '1',
      cementHelper,
      _validate: () => {
      },
      _process: () => {
      },
    });
    logic = new Logic(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    logic.helpers.set(helperName, new MockHelper(logic.cementHelper, logic.logger));
  });

  context('when everything ok', () => {
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    let result;
    before(() => {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(logic.helpers.get(helperName), '_process').withArgs(context).returns(true);
      result = logic.process(context);
    });
    after(() => {
      Brick.prototype.validate.restore();
      logic.helpers.get(helperName)._process.restore();
    });

    it('should return provider _validate() result', () =>
      expect(result).to.be.equal(
        logic.helpers.get(helperName)._process.returnValues[0]
      )
    );
  });
});
