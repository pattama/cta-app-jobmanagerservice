'use strict';

const Base = require('../base');
const RunHelper = require('./helpers/run');

const configHelper = require('./helpers/helpers/config_helper');

/**
 * Business Logic JobManager class
 *
 * @augments Base
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {BrickConfig} configuration - cement configuration of the brick
 * @property {Map<String, Helper>} helpers - Map of Helpers
 */

class Scenarios extends Base {
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);
    configHelper.setConfig(configuration.properties);
    this.helpers.set('run', new RunHelper(this.cementHelper, this.logger));
  }
}

module.exports = Scenarios;
