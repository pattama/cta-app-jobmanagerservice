'use strict';

const completedScenario = {
  id: '1111111111',
  name: 'testScenario',
  description: 'Test scenario',
  scopetested: '',
  testsuites: [
    {
      id: '1231231232',
      name: 'testTestSuite',
      applicationtested: '',
      parent: '',
    },
  ],
  configuration: {
    id: '1232131232',
    name: 'testConfig',
    targetmode: '',
    runmode: 'mono',
    type: 'physical',
    properties: [
      {
        name: 'testname',
        value: 'testvalue',
      },
    ],
  },
  pendingtimeout: 1000,
  runningtimeout: 1000,
  scheduled: true,
};

module.exports = {
  completedScenario,
};
