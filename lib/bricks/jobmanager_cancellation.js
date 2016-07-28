'use strict';

const Brick = require('cta-brick');
const executionRest = require('../httprequest/executions');
const configHelper = require('../helpers/config_helper');

const Execution = require('../objects/execution');

function createExecutionObject(context) {
  if (context.data.payload.executionid) {
    const executionId = context.data.payload.executionid;
    return executionRest.getExecution({ id: executionId });
  }
  return Promise.resolve(context.data.payload.execution);
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
            if (context.data.payload.execution) {
              /* eslint-disable no-new */
              new Execution(context.data.payload.execution);
              /* eslint-enable no-new */
              resolve();
            } else if (context.data.payload.executionid) {
              resolve();
            } else {
              reject(new Error('executionid or execution field is required'));
            }
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
      createExecutionObject(context)
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
          resolve(execution.instances.slice());
        })
        .catch((err) => reject(err));
    });
  }
}

module.exports = JobManagerCreation;
