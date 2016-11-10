'use strict';
const Logger = require('cta-logger');
const Context = require('cta-flowcontrol').Context;

const defaultLogger = new Logger();
const defaultCementHelper = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: 'restapi',
  logger: defaultLogger,
  dependencies: {
  },
  createContext: function() {},
};

class FlowControlUtils {
  static get defaultCementHelper() {
    return defaultCementHelper;
  }
  static get defaultLogger() {
    return defaultLogger;
  }
  static createContext(data, cementHelper) {
    cementHelper = cementHelper || defaultCementHelper;
    return new Context(cementHelper, data);
  }
}

module.exports = FlowControlUtils;
