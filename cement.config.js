'use strict';

const path = require('path');
const os = require('os');

const config = {
  tools: [
    {
      name: 'logger',
      module: 'cta-logger',
      properties: {},
      global: true,
      scope: 'bricks', // all, tools
      singleton: false,
    },
  ],
  bricks: [
//------------------------------------------------------------------------
    {
      name: 'mq-receiver',
      module: 'cta-receiver',
      dependencies: {
        logger: 'logger',
      },
      properties: {
        queue: 'cta.jobmanager',
        provider: {
          name: 'rabbitmq',
          options: {
            url: 'amqp://localhost',
          },
        },
      },
      publish: [
        {
          topic: 'jobmanager',
          data: [
            {
              nature: {
                type: 'execution',
                quality: 'creation',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'cancellation',
              },
            },
          ],
        },
      ],
      subscribe: [],
    },
//------------------------------------------------------------------------
    {
      name: 'jobmanager.creation',
      module: '../../../lib/bricks/jobmanager_creation',
      subscribe: [
        {
          topic: 'jobmanager',
          data: [
            {
              nature: {
                type: 'execution',
                quality: 'creation',
              },
            },
          ],
        },
      ],
      publish: [
        {
          topic: 'mq-instance-sender',
          data: [
            {
              nature: {
                type: 'execution',
                quality: 'running',
              },
            },
          ],
        },
      ],
    },
//------------------------------------------------------------------------
//    {
//      name: 'jobmanager.cancellation',
//      module: './lib/bricks/jobmanagercancellation',
//      subscribe: [
//        {
//          topic: 'jobmanager',
//          data: [
//            {
//              nature: {
//                type: 'execution',
//                quality: 'cancellation',
//              },
//            },
//          ],
//        },
//      ],
//      publish: [
//        {
//          topic: 'mq-instance-sender',
//          data: [
//            {
//              nature: {
//                type: 'execution',
//                quality: 'running',
//              },
//            },
//          ],
//        },
//      ],
//    },
//------------------------------------------------------------------------
    {
      name: 'mq-instance-sender',
      module: 'cta-sender',
      properties: {
        provider: {
          name: 'rabbitmq',
          options: {
            url: 'amqp://localhost',
          },
        },
      },
      subscribe: [
        {
          topic: 'mq-instance-sender',
          data: [{}],
        },
      ],
      publish: [
      ],
    },
//------------------------------------------------------------------------
  ],
};

module.exports = config;
