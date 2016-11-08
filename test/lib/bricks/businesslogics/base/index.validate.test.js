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

describe('BusinessLogics - Base - validate', function() {
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

  context('when everything ok', function() {
    let validatePromise;
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    before(function(done) {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(logic.helpers.get(helperName), '_validate').resolves();
      logic.validate(context).then(function(res) {
        validatePromise = res;
        done();
      }).catch(done);
    });
    after(function() {
      Brick.prototype.validate.restore();
      logic.helpers.get(helperName)._validate.restore();
    });

    it('should call super validate()', function() {
      return expect(Brick.prototype.validate.calledOnce).to.be.true;
    });

    it('should call provider _validate()', function() {
      return expect(logic.helpers.get(helperName)._validate.calledOnce).to.be.true;
    });

    it('should resolve', function() {
      return expect(validatePromise).to.have.property('ok', 1);
    });
  });

  context('when super validate rejects', function() {
    const mockError = new Error('mock error');
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').rejects(mockError);
      sinon.stub(logic.helpers.get(helperName), '_validate').resolves();
    });

    after(function() {
      Brick.prototype.validate.restore();
      logic.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = logic.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(mockError);
    });
  });

  context('when job type is not supported', function() {
    const job = _.cloneDeep(JOB);
    job.nature.type = 'not-this-logic-name';
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(logic.helpers.get(helperName), '_validate').resolves();
    });
    after(function() {
      Brick.prototype.validate.restore();
      logic.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = logic.validate(context);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, `type ${job.nature.type} not supported`);
    });
  });

  context('when job quality is not supported', function() {
    const job = _.cloneDeep(JOB);
    job.nature.quality = 'not-query';
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(logic.helpers.get(helperName), '_validate').resolves();
    });
    after(function() {
      Brick.prototype.validate.restore();
      logic.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = logic.validate(context);
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, `quality ${job.nature.quality} not supported`);
    });
  });

  context('when helper validate rejects', function() {
    const mockError = new Error('mock error');
    const job = _.cloneDeep(JOB);
    const context = { data: job };
    before(function() {
      sinon.stub(Brick.prototype, 'validate').resolves();
      sinon.stub(logic.helpers.get(helperName), '_validate').rejects(mockError);
    });

    after(function() {
      Brick.prototype.validate.restore();
      logic.helpers.get(helperName)._validate.restore();
    });

    it('should reject', function() {
      const validatePromise = logic.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(mockError);
    });
  });
});
