'use strict';

const Base = require('../base');
const CreateHelper = require('./helpers/create');
const CancelHelper = require('./helpers/cancel');
// const DropHelper = require('./helpers/drop');

const configHelper = require('./helpers/helpers/config_helper');

/**
 * Business Logic JobManager class
 *
 * @augments Base
 * @property {CementHelper} cementHelper - cementHelper instance
 * @property {BrickConfig} configuration - cement configuration of the brick
 * @property {Map<String, Helper>} helpers - Map of Helpers
 */
//TODO - discuss the name of this class
class Execution extends Base {
  constructor(cementHelper, configuration) {
    super(cementHelper, configuration);
    configHelper.setConfig(configuration.properties);
    this.helpers.set('create', new CreateHelper(this.cementHelper, this.logger));
    this.helpers.set('cancel', new CancelHelper(this.cementHelper, this.logger));
    // this.helpers.set('drop', new DropHelper(this.cementHelper, this.logger));
  }
}

module.exports = Execution;
