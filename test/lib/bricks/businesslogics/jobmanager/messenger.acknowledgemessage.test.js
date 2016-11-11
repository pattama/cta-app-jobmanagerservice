'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const EventEmitter = require('events');

const BusinessLogicsUtils = require('../utils/businesslogics');

describe('BusinessLogics - JobManager - Messenger - acknowledgeMessage', function() {

  const ackId = '1234567890';

  let sandbox;
  let messenger;
  let stubCreateContext;
  let contextMock
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    messenger = BusinessLogicsUtils.createMessenger();
    stubCreateContext = sandbox.stub(messenger.cementHelper, 'createContext');

    contextMock = new EventEmitter();
    contextMock.publish = sinon.stub();
    stubCreateContext.returns(contextMock);
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when contextMock emits done event', function() {

    it('should resolves the response', function() {
      const brickName = 'cta-io';
      const response = {};

      const promise = messenger.acknowledgeMessage(ackId);
      contextMock.emit('done', brickName, response);

      return expect(promise).to.eventually.deep.equal({
        returnCode: 'done',
        brickName: brickName,
        response: response
      }).then(() => {
        sinon.assert.calledWith(stubCreateContext, {
          nature: {
            type: 'message',
            quality: 'acknowledge'
          },
          payload: {
            id: ackId
          }
        })
      });
    });

  });

  context('when contextMock emits reject event', function() {

    it('should reject an error', function() {
      const brickName = 'cta-io';
      const err = new Error('Something went wrong');

      const promise = messenger.acknowledgeMessage(ackId);
      contextMock.emit('reject', brickName, err);

      return expect(promise).to.eventually.be.rejectedWith({
        returnCode: 'reject',
        brickName: brickName,
        response: err
      });
    });

  });

  context('when contextMock emits error event', function() {

    it('should reject an error', function() {
      const brickName = 'cta-io';
      const err = new Error('Something went wrong');

      const promise = messenger.acknowledgeMessage(ackId);
      contextMock.emit('error', brickName, err);

      return expect(promise).to.eventually.be.rejectedWith({
        returnCode: 'error',
        brickName: brickName,
        response: err
      });
    });

  });
});
