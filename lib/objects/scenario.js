// + id:ObjectId
// + name:String
// + description: String
// + scopetested:String
// + testsuites:[ObjectId(TestSuite)]
// + configuration:ObjectId(Configuration)
// + pendingtimeout:Long
// + runningtimeout:Long
// + scheduled:Boolean
// - schedule: ObjectId(Schedule)
// - scheduletimestamp:Long
// - afterhandlers:[ObjectId(AfterHandlers)]
'use strict';

const _ = require('lodash');

const testsuitesSymbol = Symbol('testsuites');
const configurationSymbol = Symbol('configuration');

function validateRequired(data) {
  const requiredFields = [
    'id',
    'name',
    'description',
    'scopetested',
    'testsuites',
    'configuration',
    'pendingtimeout',
    'runningtimeout',
    'scheduled',
  ];

  requiredFields.forEach((requiredField) => {
    if (!data.hasOwnProperty(requiredField)) {
      throw new Error(`${requiredField} is required.`);
    }
  });
}

function validateTestSuited(testsuites) {
  if (!Array.isArray(testsuites)) {
    throw new Error('testsuites should be an array');
  }

  const requiredFields = [
    'id',
    'name',
    'applicationtested',
    'parent',
  ];

  testsuites.forEach((testsuite) => {
    requiredFields.forEach((requiredField) => {
      if (!testsuite.hasOwnProperty(requiredField)) {
        throw new Error(`testsuite.${requiredField} is required.`);
      }
    });
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
    this.name = data.name;
    this.description = data.description;
    this.scopetested = data.scopetested;
    this.testsuites = data.testsuites;
    this.configuration = data.configuration;
    this.pendingtimeout = data.pendingtimeout;
    this.runningtimeout = data.runningtimeout;
    this.scheduled = data.scheduled;

    this.schedule = data.schedule;
    this.scheduletimestamp = data.scheduletimestamp;
    this.afterhandlers = data.afterhandlers;
  }

  set testsuites(testsuites) {
    //validateTestSuited(testsuites);
    this[testsuitesSymbol] = testsuites;
  }

  get testsuites() {
    return this[testsuitesSymbol];
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
      name: this.name,
      description: this.description,
      scopetested: this.scopetested,
      testsuites: this.testsuites.slice(),
      configuration: Object.assign({}, this.configuration),
      pendingtimeout: this.pendingtimeout,
      runningtimeout: this.runningtimeout,
      scheduled: this.scheduled,
    };
  }
}

module.exports = Scenario;
