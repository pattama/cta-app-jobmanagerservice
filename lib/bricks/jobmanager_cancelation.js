'use strict';

const Brick = require('cta-brick');
const executionRest = require('../httprequest/executions');
const configHelper = require('../helpers/config_helper');

const Execution = require('../objects/execution');

function createExecutionObject(context) {
  if (context.data.payload.executionid) {
    const executionId = context.data.payload.executionid;
    return executionRest.getExecution(executionId);
  }
  return Promise.resolve(context.data.payload.execution);
}

class JobManagerCancelation extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    configHelper.setConfig(config);
  }
  validate(context) {
    return new Promise((resolve, reject) => {
      super.validate(context)
        .then(() => {
          try {
            if (context.data.payload.execution) {
              /* eslint-disable no-new */
              // For validation
              new Execution(context.data.payload.execution);
              /* eslint-enable no-new */
              resolve();
            } else if (context.data.payload.executionid) {
              resolve();
            } else {
              throw new Error('executionid or execution field is required');
            }
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => reject(err));
    });
  }
  process(context) {
    return new Promise((resolve, reject) => {
      createExecutionObject(context)
        .then((execution) => {
          const expectedCallCount = execution.instances.length;
          let counter = 0;
          execution.instances.forEach((instance) => {
            const sentContext = this.cementHelper
              .createContext({
                id: `${context.data.id}-${execution.scenario.id}`,
                payload: {
                  // id: context.data.id,
                  queue: instance.hostname,
                  message: execution,
                },
              });
            sentContext.on('reject', () => {
              const sentToQContext = this.cementHelper
                .createContext({
                  id: '',
                  nature: {
                    type: 'execution',
                    quality: 'cancelation',
                  },
                  payload: {
                    jobid: '',
                  },
                });
              sentToQContext.publish();
              counter++;
              if (counter === expectedCallCount) {
                resolve(execution.instances.slice());
              }
            });
            sentContext.on('done', () => {
              counter++;
              if (counter === expectedCallCount) {
                resolve(execution.instances.slice());
              }
            });
            sentContext.publish();
          });
        })
        .catch((err) => reject(err));
    });
  }
}

module.exports = JobManagerCancelation;
