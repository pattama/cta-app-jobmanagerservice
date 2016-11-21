# Job Manager
Application for Compass Test Automation

## Summary
* [Rest API](RESTAPI.md)
* [DataContract](DATACONTRACT.md)
* [Document](DOCUMENTATION.md)
* [Sequence Diagrams](https://www.lucidchart.com/documents/edit/d15cef2b-8b80-4ce0-8e2c-1f3deee1759c)


## Configuration
```ruby
{
  name: 'jobmanager',
  module: './bricks/businesslogics/jobmanager/index.js',
  properties: {
    executionsUrl: 'http://localhost:3010/executions',
    instancesUrl: 'http://pastebin.com/raw/dx5s9T3j'
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
}
```
