'use strict';
const config = {
  name: 'cta-app-jobmanager',
  /**
   * Tools
   */
  tools: [
    {
      name: 'logger',
      module: 'cta-logger',
      properties: {
        level: 'info',
      },
      scope: 'all',
    },
    {
      name: 'messaging',
      module: 'cta-messaging',
      properties: {
        provider: 'rabbitmq',
        parameters: {
          url: 'amqp://localhost?heartbeat=60',
        },
      },
      singleton: true,
    },
    {
      name: 'my-express',
      module: 'cta-expresswrapper',
      properties: {
        port: 3012,
      },
      singleton: true,
    },
    {
      name: 'requesttool',
      module: 'cta-tool-request',
      properties: {},
    },
  ],
  bricks: [
//------------------------------------------------------------------------
    {
      name: 'mq-receiver',
      module: 'cta-io',
      dependencies: {
        messaging: 'messaging',
      },
      properties: {
        input: {
          queue: 'cta.jobmanager',
        },
      },
      publish: [
        {
          topic: 'jobmanager',
          data: [
            {
              nature: {
                type: 'execution',
                quality: 'run',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'cancel',
              },
            },
          ],
        },
      ],
      subscribe: [
        {
          topic: 'acknowledge',
          data: [
            {
              nature: {
                type: 'message',
                quality: 'acknowledge',
              },
            },
          ],
        },
      ],
    },
//------------------------------------------------------------------------
    {
      name: 'jobmanager',
      module: './bricks/businesslogics/jobmanager/index.js',
      properties: {
        executionsUrl: 'http://localhost:3010/executions',
        // instancesUrl: 'http://pastebin.com/raw/eK8dvRHY',    // return 0 machine
        instancesUrl: 'http://pastebin.com/raw/dx5s9T3j',    // return 2 machines
      },
      dependencies: {
        messaging: 'messaging',
      },
      subscribe: [
        {
          topic: 'jobmanager',
          data: [
            {
              nature: {
                type: 'execution',
                quality: 'run',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'cancel',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'timeout',
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
                type: 'message',
                quality: 'get',
              },
            },
            {
              nature: {
                type: 'message',
                quality: 'produce',
              },
            },
          ],
        },
        {
          topic: 'acknowledge',
          data: [
            {
              nature: {
                type: 'message',
                quality: 'acknowledge',
              },
            },
          ],
        },
        {
          topic: 'requests.com',
          data: [
            {
              nature: {
                type: 'request',
                quality: 'exec',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'mq-instance-sender',
      module: 'cta-io',
      dependencies: {
        messaging: 'messaging',
      },
      properties: {
        output: {
          queue: 'queue',
          topic: 'schedule.synchronize',
        },
      },
      subscribe: [
        {
          topic: 'mq-instance-sender',
          data: [
            {
              nature: {
                type: 'message',
                quality: 'get',
              },
            },
            {
              nature: {
                type: 'message',
                quality: 'produce',
              },
            }],
        },
      ],
      publish: [
      ],
    },
//------------------------------------------------------------------------
    {
      name: 'restapi',
      module: 'cta-restapi',
      dependencies: {
        express: 'my-express',
      },
      properties: {
        providers: [
          {
            name: 'jobmanager',
            module: './utils/restapi/handlers/jobmanager.js',
            routes: [
              {
                method: 'post', // http method get|post|put|delete
                handler: 'actions', // name of the method in your provider
                path: '/jobmanager/executions/:id/actions', // the route path
              },
            ],
          },
        ],
      },
      publish: [
        {
          topic: 'jobmanager',
          data: [
            {
              nature: {
                type: 'execution',
                quality: 'cancel',
              },
            },
            {
              nature: {
                type: 'execution',
                quality: 'timeout',
              },
            },
          ],
        },
      ],
    },
//------------------------------------------------------------------------
    {
      name: 'request',
      module: 'cta-brick-request',
      dependencies: {
        request: 'requesttool',
      },
      properties: {},
      subscribe: [
        {
          topic: 'requests.com',
          data: [
            {
              nature: {
                type: 'request',
                quality: 'exec',
              },
            },
          ],
        },
      ],
    },
//------------------------------------------------------------------------
  ],
};

module.exports = config;
