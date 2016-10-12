'use strict';
const appRootPath = require('app-root-path').path;
const sinon = require('sinon');
const nodepath = require('path');
const ObjectID = require('bson').ObjectID;

const EventEmitter = require('events');
const Logger = require('cta-logger');
const Handler = require(nodepath.join(appRootPath,
  '/lib/utils/restapi/handlers/', 'jobmanager.js'));

const DEFAULTLOGGER = new Logger();
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: 'restapi',
  logger: DEFAULTLOGGER,
  dependencies: {
  },
  createContext: function() {},
};

describe('Utils - RESTAPI - Handlers - JobManager - cancelExecution', function() {
  let handler;
  before(function() {
    handler = new Handler(DEFAULTCEMENTHELPER);
  });
  context('when everything ok', function() {
    const req = {};
    const res = {
      status: function() {
        return this;
      },
      send: function() {},
    };
    let data;
    let mockContext;
    before(function() {
      req.params = {
        id: (new ObjectID()).toString(),
      };
      data = {
        nature: {
          type: 'execution',
          quality: 'cancel',
        },
        payload: {
          execution: {
            id: req.params.id
          }
        },
      };
      mockContext = new EventEmitter();
      mockContext.publish = sinon.stub();
      sinon.stub(handler.cementHelper, 'createContext')
        .withArgs(data)
        .returns(mockContext);
    });
    after(function() {
      handler.cementHelper.createContext.restore();
    });
    it('should send a new Context', function() {
      handler.cancelExecution(req, res, null);
      sinon.assert.calledWith(handler.cementHelper.createContext, data);
      sinon.assert.called(mockContext.publish);
    });

    context('when Context emits done event', function() {
      context('when document is found', function() {
        before(function() {
          sinon.spy(res, 'send');
          handler.cancelExecution(req, res, null);
        });
        after(function() {
          res.send.restore();
        });
        it('should send the found Object (res.send())', function() {
          const mockBrickname = 'businesslogic';
          const response = { id: req.params.id };
          mockContext.emit('done', mockBrickname, response);
          sinon.assert.calledWith(res.send, response);
        });
      });

    // context('when document is not found', function() {
    //   before(function() {
    //     sinon.spy(res, 'status');
    //     sinon.spy(res, 'send');
    //     handler.cancelExecution(req, res, null);
    //   });
    //   after(function() {
    //     res.status.restore();
    //     res.send.restore();
    //   });
    //   it('should send 404', function() {
    //     const mockBrickname = 'businesslogic';
    //     const response = null;
    //     mockContext.emit('done', mockBrickname, response);
    //     sinon.assert.calledWith(res.status, 404);
    //     sinon.assert.calledWith(res.send, 'Execution not found.');
    //   });
    // });
  });

    context('when Context emits error event', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.cancelExecution(req, res, null);
      });
      after(function() {
        res.status.restore();
        res.send.restore();
      });
      it('should send the error message', function () {
        const error = new Error('mockError');
        const mockBrickname = 'businesslogic';
        mockContext.emit('error', mockBrickname, error);
        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.send, error.message);
      });
    });

    context('when Context emits reject event', function() {
      before(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'send');
        handler.cancelExecution(req, res, null);
      });
      after(function() {
        res.status.restore();
        res.send.restore();
      });
      it('should send the error message', function () {
        const error = new Error('mockError');
        const mockBrickname = 'businesslogic';
        mockContext.emit('reject', mockBrickname, error);
        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.send, error.message);
      });
    });
  });
});
