'use strict';

const Brick = require('cta-brick');
const executionRest = require('../httprequest/executions');
const instancesRest = require('../httprequest/instances');
const configHelper = require('../helpers/config_helper');

const Scenario = require('../objects/scenario');
const Execution = require('../objects/execution');
const User = require('../objects/user');

// const RUNMODE = {
//   MONO: 'mono',
//   GROUP: 'group',
//   STRESS: 'stress',
//   PARALELL: 'paralell',
// };

function selectInstanceToRun(config, instances) {
  // switch (config.runmode) {
  //   case RUNMODE.MONO:
  //     return [instances[0]];
  //   case RUNMODE.GROUP:
  //   case RUNMODE.PARALELL:
  //     return instances.slice();
  //   case RUNMODE.STRESS:
  //     // TODO: Fixes amount of instance field
  //     return instances.slice();
  //   default:
  //     return null;
  // }
  return [instances[0]];
}

class JobManagerCreation extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    this.context = this.cementHelper.createContext({});
    configHelper.setConfig(config);
  }
  validate(context) {
    return new Promise((resolve, reject) => {
      super.validate(context)
        .then(() => {
          try {
            if (!context.data.payload.hasOwnProperty('user')) {
              throw new Error('user field is require');
            }
            if (!context.data.payload.hasOwnProperty('scenario')) {
              throw new Error('scenario field is require');
            }

            this.scenario = new Scenario(context.data.payload.scenario);
            this.user = new User(context.data.payload.user);
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  process(context) {
    return new Promise((resolve, reject) => {
      if (!this.scenario) {
        this.scenario = new Scenario(context.data.payload.scenario);
      }
      if (!this.user) {
        this.user = new User(context.data.payload.user);
      }
      const scenario = this.scenario;
      const user = this.user;
      const createScenarioPromise = executionRest.upsertExecutions({
        scenario: scenario.toJSON(),
        user: user.toJSON(),
      });
      const instancePromise = instancesRest.getMatchingInstances({
        type: scenario.configuration.type,
        properties: scenario.configuration.properties,
      });

      Promise.all([createScenarioPromise, instancePromise])
        .then((results) => {
          const execution = new Execution(results[0]);
          execution.instances = selectInstanceToRun(scenario.configuration, results[1]);
          return executionRest.upsertExecutions(execution.toJSON());
        })
        .then((execution) => {
          execution.instances.forEach((instance) => {
            this.context.data = {
              payload: {
                queue: instance.hostname,
                message: execution,
              },
            };
            this.context.publish();
          });
          resolve();
        })
        .catch((err) => reject(err));
    });
  }
}

module.exports = JobManagerCreation;
