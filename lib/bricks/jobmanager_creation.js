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
    configHelper.setConfig(config.properties);
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
            /* eslint-disable no-new */
            // For validation
            new Scenario(context.data.payload.scenario);
            new User(context.data.payload.user);
            /* eslint-enable no-new */
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => reject(err));
    });
  }
  process(context) {
    return new Promise((resolve, reject) => {
      const scenario = new Scenario(context.data.payload.scenario);
      const user = new User(context.data.payload.user);
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
          const instances = selectInstanceToRun(scenario.configuration, results[1]);
          return executionRest.updateExecution(execution.id, {instances});
        })
        .then((execution) => {
          execution.instances.forEach((instance) => {
            this.context.data = {
              id: execution.id,
              nature: context.data.nature,
              queue: instance.hostname,
              message: {
                id: execution.id,
                nature: context.data.nature,
                payload: execution,
              },
            };
            this.context.publish();
          });
          resolve();
        })
        .catch((err) => {
          this.logger.error('error: ', err);
          context.emit('reject', err);
          reject(err);
        });
    });
  }
}

module.exports = JobManagerCreation;
