'use strict';

const chai = require('chai');
const expect = chai.expect;

const User = require('../../../lib/utils/datamodels/user');

describe('User', () => {
  const userData = {
    id: '123456780',
    first: 'Jobmanager',
    last: 'Brick',
    email: 'jobmanager.brick@thomsonreuters.com',
    uid: '0000000',
  };

  describe('validation', () => {
    it('should create correctly', () => {
      const user = new User(userData);

      expect(user).to.have.property('id', userData.id);
      expect(user).to.have.property('first', userData.first);
      expect(user).to.have.property('last', userData.last);
      expect(user).to.have.property('email', userData.email);
      expect(user).to.have.property('uid', userData.uid);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON', () => {
      const user = new User(userData);
      const userJSON = user.toJSON();
      expect(userJSON).eql(userData);
    });
  });
});
