'use strict';

const Brick = require('cta-brick');
const defaultLogger = require('cta-logger');

class MyClass extends Brick {
  /**
   * constructor - Create a new Brick instance
   *
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} config - cement configuration of the brick
   */
  constructor(cementHelper, config) {
    super(cementHelper, config);

    this.logger = defaultLogger();
  }

  /**
   * Validates Context properties
   * @param {Context} context - a Context
   * @returns {Promise}
   */
  validate(context) {
    this.logger.info('context:', context);
    return new Promise((resolve) => resolve());
  }

  /**
   * Process the context
   * @param {Context} context - a Context
   */
  process(context) {
    this.logger.info('context:', context);
  }
}

module.exports = MyClass;
