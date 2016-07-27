'use strict';

const logger = require('cta-logger');

const MockContext = require('./context');

const DEFAULTLOGGER = logger();
// const DEFAULTCTAEXPRESS = {
//   app: {},
//   post() { },
//   get() { },
// };

class MockCementHelper {
  constructor() {
    this.brickName = 'mockbrick';
    this.logger = DEFAULTLOGGER;
  }
  createContext(context) {
    return new MockContext(this, context);
  }
}

module.exports = MockCementHelper;
