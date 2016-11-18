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
    messaging: {
      get: () => {},
    },
  },
  createContext: () => {},
};

class FlowControlUtils {
  static get defaultCementHelper() {
    return defaultCementHelper;
  }
  static get defaultLogger() {
    return defaultLogger;
  }
  static createContext(data, cementHelper) {
    if (cementHelper) {
      return new Context(cementHelper, data);
    }
    return new Context(defaultCementHelper, data);
  }
}

module.exports = FlowControlUtils;
