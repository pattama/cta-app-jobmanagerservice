/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

const Base = require('../base');
const CancelHelper = require('./helpers/cancel');
const TimeoutHelper = require('./helpers/timeout');

const configHelper = require('./helpers/helpers/config_helper');

/**
 * Business Logic JobManager class
 *
 * @augments Base
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {BrickConfig} configuration - cement configuration of the brick
 * @property {Map<String, Helper>} helpers - Map of Helpers
 */

class Executions extends Base {
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);
    configHelper.setConfig(configuration.properties);
    this.helpers.set('cancel', new CancelHelper(this.cementHelper, this.logger));
    this.helpers.set('timeout', new TimeoutHelper(this.cementHelper, this.logger));
  }
}

module.exports = Executions;
