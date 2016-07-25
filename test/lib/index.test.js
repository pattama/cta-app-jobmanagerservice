'use strict';

const chai = require('chai');
const expect = chai.expect;

const MyClass = require('../../lib');

describe('MyClass', () => {
  it('should have correct properties', () => {
    expect(MyClass.prototype).to.have.property('validate');
    expect(MyClass.prototype).to.have.property('process');
  });
});
