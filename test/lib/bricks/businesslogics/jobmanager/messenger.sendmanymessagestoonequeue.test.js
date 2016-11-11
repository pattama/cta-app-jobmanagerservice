'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const EventEmitter = require('events');

const BusinessLogicsUtils = require('../utils/businesslogics');

describe('BusinessLogics - JobManager - Messenger - sendManyMessagesToOneQueue', function() {

  const messages = [{}, {}, {}];
  const queue = 'queue';
  const options = { autoDelete: true, expires: 1000 };

  let sandbox;
  let messenger;
  let stubSendOneMessageToOneQueue;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    messenger = BusinessLogicsUtils.createMessenger();
    stubSendOneMessageToOneQueue = sandbox.stub(messenger, 'sendOneMessageToOneQueue');

  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when everythis is ok', function() {

    it('should resolves', function() {
      stubSendOneMessageToOneQueue.resolves();
      const promise = messenger.sendManyMessagesToOneQueue(messages, queue, options);

      return promise.then(() => {
        sinon.assert.calledThrice(stubSendOneMessageToOneQueue);
      });
    });

  });
});
