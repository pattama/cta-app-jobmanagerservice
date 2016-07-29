// + id:ObjectId
// + scenario:ObjectId(Scenario)
// + configuration:ObjectId(Configuration)
// - starttimestamp:Long
// - updatetimestamp:Long
// + user:ObjectId(User)
// - state:String // pending,running,acked, cancelled, finished
// - status:String // succeeded, inconclusive, partial, failed
// - ok:Long,
// - partial:Long,
// - inconclusive:Long
// - failed:Long,
// - nbstatuses:Long // sum(ok, partial...)
// - done:Boolean

'use strict';

const _ = require('lodash');

const configurationSymbol = Symbol('configuration');

function validateRequired(data) {
  const requiredFields = [
    'id',
    'scenario',
    'configuration',
    'user',
  ];

  requiredFields.forEach((requiredField) => {
    if (!data.hasOwnProperty(requiredField)) {
      throw new Error(`${requiredField} is required.`);
    }
  });
}

function validateConfiguration(configuration) {
  if (!_.isPlainObject(configuration)) {
    throw new Error('configuration should be a object');
  }

  const requiredFields = [
    'id',
    'name',
    'targetmode',
    'runmode',
  ];

  requiredFields.forEach((requiredField) => {
    if (!configuration.hasOwnProperty(requiredField)) {
      throw new Error(`configuration.${requiredField} is required.`);
    }
  });
}


class Scenario {
  constructor(data) {
    //validateRequired(data);

    this.id = data.id;
    this.scenario = data.scenario;
    //this.configuration = data.configuration;
    this.starttimestamp = data.starttimestamp;
    this.updatetimestamp = data.updatetimestamp;
    this.user = data.user;
    this.state = data.state;
    this.status = data.status;
    this.ok = data.ok;
    this.partial = data.partial;
    this.inconclusive = data.inconclusive;
    this.failed = data.failed;
    this.nbstatuses = data.nbstatuses;
    this.done = data.done;

    this.instances = data.instances;
  }

  set configuration(configuration) {
    //validateConfiguration(configuration);
    this[configurationSymbol] = configuration;
  }

  get configuration() {
    return this[configurationSymbol];
  }

  toJSON() {
    return {
      id: this.id,
      scenario: this.scenario,
      configuration: this.configuration,
      user: this.user,
      starttimestamp: this.starttimestamp,
      updatetimestamp: this.updatetimestamp,
      state: this.state,
      status: this.status,
      ok: this.ok,
      partial: this.partial,
      inconclusive: this.inconclusive,
      failed: this.failed,
      nbstatuses: this.nbstatuses,
      done: this.done,
      instances: this.instances,
    };
  }
}

module.exports = Scenario;
