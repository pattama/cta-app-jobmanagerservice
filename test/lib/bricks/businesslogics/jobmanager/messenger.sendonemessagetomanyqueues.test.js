'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-as-promised'));

const BusinessLogicsUtils = require('../utils/businesslogics');

describe('BusinessLogics - JobManager - Messenger - sendOneMessageToManyQueues', () => {
  const message = {};
  const queues = ['queue1', 'queue2'];
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

  context('when everythis is ok', () => {
    it('should resolves', () => {
      stubSendOneMessageToOneQueue.resolves();
      const promise = messenger.sendOneMessageToManyQueues(message, queues, options);

      return promise.then(() => {
        sinon.assert.calledTwice(stubSendOneMessageToOneQueue);
      });
    });
  });
});
