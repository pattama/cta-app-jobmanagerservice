'use strict';

const data = {
  requestTimestamp: 1234567890,
  scenario: {
    id: '57e0e3ff7f256e3368cc4ecb',
    name: 'testScenario',
    description: 'Test scenario',
    scopetested: '',
    pendingtimeout: 1000,
    runningtimeout: 1000,
    scheduled: true,
    testSuite: {
      id: '57e0e3ff7f256e3368cc4ecb',
      name: 'Testsuite',
      inputRepository: [{
        type: 'git',
        url: 'https://….git',
        mountpoint: 'C:/temp',
      }],
      tests: [{
        id: '57e0e3ff7f256e3368cc4ecb',
        name: 'Test 1',
        description: 'test test',
        type: 'commandLine',
        stages: [{
          name: 'stage',
          run: 'notepad.exe',
          stop: 'echo Test - Do stop operations...',
          cwd: 'C:\\tmp',
          env: [{
            key: 'foo',
          }],
          mandatory: true,
          timeout: 1000,
        }],
      }],
    },
  },
  configuration: {
    id: '1232131232',
    name: 'testConfig',
    targetmode: '',
    runMode: 'mono',
    type: 'physical',
    properties: [
      {
        name: 'testname',
        value: 'testvalue',
      },
    ],
  },
  user: {
    id: '1234567890',
    first: 'Manassorn',
    last: 'Vanichdilokkul',
    uid: '6029457',
  },
};

const job = {
  id: '12346579890',
  nature: {
    type: 'execution',
    quality: 'create',
  },
  payload: data,
};

module.exports = job;
