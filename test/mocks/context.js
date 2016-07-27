'use strict';

const EventEmitter = require('events');

class MockContext extends EventEmitter {
  constructor(cementHelper, data) {
    super();
    this.cementHelper = cementHelper;
    this.from = cementHelper.brickName;
    this.data = data;
  }
  publish() {
  }
}

module.exports = MockContext;
