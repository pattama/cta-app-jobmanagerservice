'use strict';

const Base = require('../base');
const RunHelper = require('./helpers/run');
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

class Execution extends Base {
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);
    configHelper.setConfig(configuration.properties);
    this.helpers.set('run', new RunHelper(this.cementHelper, this.logger));
    this.helpers.set('cancel', new CancelHelper(this.cementHelper, this.logger));
    this.helpers.set('timeout', new TimeoutHelper(this.cementHelper, this.logger));
  }
}

module.exports = Execution;
