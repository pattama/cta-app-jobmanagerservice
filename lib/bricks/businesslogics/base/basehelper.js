/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const validate = require('cta-common').validate;

/**
 * Business Logic Helper Base class
 *
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {Logger} logger - logger instance
 */
class BaseHelper {
  /**
   * constructor - Create a new Business Logic Helper Base instance
   *
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {Logger} logger - logger instance
   */
  constructor(cementHelper, logger) {
    if (!validate(cementHelper, { type: 'object' }).isValid) {
      throw (new Error('missing/incorrect \'cementHelper\' CementHelper argument'));
    }
    this.cementHelper = cementHelper;

    if (!validate(logger, { type: 'object' }).isValid) {
      throw (new Error('missing/incorrect \'logger\' Logger argument'));
    }
    this.logger = logger;
  }

  /**
   * Validates Context properties specific to this Helper
   * @param {Context} context - a Context
   * @abstract
   * @returns {Promise}
   */
  _validate(context) { // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      resolve({ ok: 1 });
    });
  }

  /**
   * Process the context
   * @abstract
   * @param {Context} context - a Context
   * @returns {Context}
   */
  _process(context) {
    context.emit('done', this.cementHelper.brickName, context.data);
  }
}

module.exports = BaseHelper;
