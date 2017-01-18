'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const EventEmitter = require('events');

const BusinessLogicsUtils = require('../utils/businesslogics');

describe('BusinessLogics - JobManager - Messenger - sendOneMessageToOneQueue', () => {
  const message = {};
  const queue = 'queue';
  const options = { autoDelete: true, expires: 1000 };

  let sandbox;
  let messenger;
  let stubCreateContext;
  let contextMock;
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

  context('when contextMock emits done event', () => {
    it('should resolves the response', () => {
      const brickName = 'cta-io';
      const response = {};

      const promise = messenger.sendOneMessageToOneQueue(message, queue, options);
      contextMock.emit('done', brickName, response);

      return expect(promise).to.eventually.deep.equal({
        returnCode: 'done',
        brickName,
        response,
      }).then(() => {
        sinon.assert.calledWith(stubCreateContext, {
          nature: {
            type: 'messages',
            quality: 'produce',
          },
          payload: {
            queue,
            message,
            autoDelete: options.autoDelete,
            expires: options.expires,
          },
        });
      });
    });
  });

  context('when contextMock emits reject event', () => {
    it('should reject an error', () => {
      const brickName = 'cta-io';
      const err = new Error('Something went wrong');

      const promise = messenger.sendOneMessageToOneQueue(message, queue, options);
      contextMock.emit('reject', brickName, err);

      return expect(promise).to.eventually.be.rejectedWith({
        returnCode: 'reject',
        brickName,
        response: err,
      });
    });
  });

  context('when contextMock emits error event', () => {
    it('should reject an error', () => {
      const brickName = 'cta-io';
      const err = new Error('Something went wrong');

      const promise = messenger.sendOneMessageToOneQueue(message, queue, options);
      contextMock.emit('error', brickName, err);

      return expect(promise).to.eventually.be.rejectedWith({
        returnCode: 'error',
        brickName,
        response: err,
      });
    });
  });
});
