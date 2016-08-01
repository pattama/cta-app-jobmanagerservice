'use strict';

const Brick = require('cta-brick');
const Messaging = require('cta-messaging');

const configHelper = require('../helpers/config_helper');

const EVENTS = require('../enum/events');

class JobManagerDrop extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    this.context = this.cementHelper.createContext({});
    const provider = this.properties.provider.name || 'rabbitmq';
    const parameters = this.properties.provider.options || {};
    this.queue = this.properties.queue || 'output_queue';
    this.messaging = new Messaging({ provider, parameters });
    configHelper.setConfig(config);
  }
  validate(context) {
    return new Promise((resolve, reject) => {
      super.validate(context)
        .then(() => {
          if (context.data.nature.type === 'message' ||
              context.data.nature.quality === 'drop') {
            resolve();
          } else {
            reject(new Error('type must be message and quality must be drop'));
          }
        });
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
