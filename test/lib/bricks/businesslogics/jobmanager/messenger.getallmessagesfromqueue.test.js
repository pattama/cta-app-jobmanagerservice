'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const BusinessLogicsUtils = require('../utils/businesslogics');

describe('BusinessLogics - JobManager - Messenger - getAllMessagesFromQueue', () => {
  const queue = 'queue';

  let sandbox;
  let messenger;
  let stubMessagingGet;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    messenger = BusinessLogicsUtils.createMessenger();
    stubMessagingGet = sandbox.stub(messenger.cementHelper.dependencies.messaging, 'get');
  });
  afterEach(() => {
    sandbox.restore();
  });

  context('when contextMock emits done event', () => {
    it('should resolves the response', () => {
      stubMessagingGet.onCall(0).resolves({ result: { content: 1 } });
      stubMessagingGet.onCall(1).resolves({ result: { content: 2 } });
      stubMessagingGet.onCall(2).resolves({ result: { content: null } });

      const promise = messenger.getAllMessagesFromQueue(queue);
      return expect(promise).to.eventually.deep.equal([1, 2])
        .then(() => {
          sinon.assert.calledThrice(stubMessagingGet);
          sinon.assert.calledWith(stubMessagingGet, {
            queue,
            ack: 'auto',
          });
        });
    });
  });
});
