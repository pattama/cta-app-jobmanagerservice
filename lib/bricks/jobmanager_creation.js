'use strict';

const Brick = require('cta-brick');
const executionRest = require('../httprequest/executions');
const instancesRest = require('../httprequest/instances');

const Scenario = require('../objects/scenario');
const Execution = require('../objects/execution');

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
  }
  validate(context) {
    return new Promise((resolve, reject) => {
      super.validate(context)
        .then(() => {
          try {
            this.scenario = new Scenario(context.data.payload);
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
        this.scenario = new Scenario(context.data.payload);
      }
      const scenario = this.scenario;
      const createScenarioPromise = executionRest.upsertExecutions({
        scenario: scenario.id,
        configuration: scenario.configuration,
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
