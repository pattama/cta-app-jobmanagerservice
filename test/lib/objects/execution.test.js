'use strict';

const chai = require('chai');
const expect = chai.expect;

const _ = require('lodash');

const Execution = require('../../../lib/objects/execution');

describe('Execution', () => {
  const executionData = {
    id: '12345566789',
    scenario: '1111111111',
    user: '22222222',
  };
  const executionFullData = {
    id: '12345566789',
    scenario: '1111111111',
    user: '22222222',
    starttimestamp: 1213,
    updatetimestamp: 1214,
    state: 'pending',
    cancel: {
      mode: '',
      user: {
        first: 'job',
        last: 'manager',
      },
    },
    status: 'succeeded',
    ok: 1,
    partial: 1,
    inconclusive: 1,
    failed: 1,
    nbstatuses: 4,
    done: true,
    instances: [],
  };
  describe('validation', () => {
    it('should create correctly', () => {
      const execution = new Execution(executionData);

      expect(execution).to.have.property('id', executionData.id);
      expect(execution).to.have.property('scenario', executionData.scenario);
      expect(execution).to.have.property('user', executionData.user);
      expect(execution).to.have.property('cancel', executionData.cancel);

      expect(execution).to.have.property('starttimestamp');
      expect(execution).to.have.property('updatetimestamp');
      expect(execution).to.have.property('state');
      expect(execution).to.have.property('status');
      expect(execution).to.have.property('ok');
      expect(execution).to.have.property('partial');
      expect(execution).to.have.property('inconclusive');
      expect(execution).to.have.property('failed');
      expect(execution).to.have.property('nbstatuses');
      expect(execution).to.have.property('done');
      expect(execution).to.have.property('instances');
    });

    function testRequiredField(field) {
      return function testFunction() {
        const cloneExecutionData = Object.assign({}, executionData);
        delete cloneExecutionData[field];
        expect(() => {
          /* eslint-disable no-new */
          new Execution(cloneExecutionData);
          /* eslint-enable no-new */
        }).to.throw(Error, `${field} is required`);
      };
    }

    it('should required id field', testRequiredField('id'));
    it('should required scenario field', testRequiredField('scenario'));
    it('should required user field', testRequiredField('user'));
  });

  describe('toJSON', () => {
    it('should return correct JSON', () => {
      const execution = new Execution(executionFullData);
      expect(execution.toJSON()).eql(_.omitBy(executionFullData, _.isNil));
    });
  });

  describe.skip('getRunnigJSON', () => {
    it('should return correct JSON', () => {
      // const execution = new Execution(executionFullData);
      // expect(execution.toJSON()).eql(executionFullData);
    });
  });
});
