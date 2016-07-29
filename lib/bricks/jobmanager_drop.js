'use strict';

const Brick = require('cta-brick');
const ctaMessaging = require('cta-messaging');

const configHelper = require('../helpers/config_helper');

const EVENTS = require('../enum/events');

class JobManagerDrop extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    this.context = this.cementHelper.createContext({});
    this.messaging = ctaMessaging();
    configHelper.setConfig(config);
  }
  validate() {
    return new Promise(() => {
      // super.validate(context)
    //     .then(() => {
    //       try {
    //         if (context.data.payload.execution) {
    //           /* eslint-disable no-new */
    //           // For validation
    //           new Execution(context.data.payload.execution);
    //           /* eslint-enable no-new */
    //           resolve();
    //         } else if (context.data.payload.executionid) {
    //           resolve();
    //         } else {
    //           throw new Error('executionid or execution field is required');
    //         }
    //       } catch (err) {
    //         reject(err);
    //       }
    //     })
    //     .catch((err) => reject(err));
    });
  }
  process(context) {
    const queue = context.data.payload.queue;
    const id = context.data.id;
    const messaging = this.messaging;

    const consumeRecursive = () => {
      const cb = (q) => {
        if (q.id === id) {
          return this.context.emit(EVENTS.DONE, q);
        }
        return messaging.produce({ queue, json: q })
          .then(() => consumeRecursive());
      };
      return messaging.consume({ queue, cb })
        .catch(() => {
          this.context.emit(EVENTS.REJECT, true);
        });
    };

    consumeRecursive();
  }
}

module.exports = JobManagerDrop;
