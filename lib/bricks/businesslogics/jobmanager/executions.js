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
