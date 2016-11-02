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
      name: 'jobmanager.run',
      module: './bricks/businesslogics/jobmanager/index.js',
      properties: {
        executionsUrl: 'http://localhost:3010/executions',
        //instancesUrl: 'http://pastebin.com/raw/CrF1dknQ',     // return 1 machine
        instancesUrl: 'http://pastebin.com/raw/gQESjwAX',  // return 2 machines
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
          data: [{
            nature: {
              type: 'message',
              quality: 'get'
            }
          },
          {
            nature: {
              type: 'message',
              quality: 'produce'
            }
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
            module: './utils/restapi/handlers/jobmanager.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
            routes: [
              {
                method: 'post', // http method get|post|put|delete
                handler: 'cancelExecution', // name of the method in your provider
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
          ],
        },
      ], // don't forget to define this property so that you are able to send jobs to the next bricks
    },
//------------------------------------------------------------------------
  ],
};

module.exports = config;
