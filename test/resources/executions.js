'use strict';

const completedExecution = {
  id: '2222222222',
  scenario: '1111111111',
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
  user: '3333333333',
  starttimestamp: 1213,
  updatetimestamp: 1214,
  state: 'pending',
  status: 'succeeded',
  ok: 1,
  partial: 1,
  inconclusive: 1,
  failed: 1,
  nbstatuses: 4,
  done: true,
};

module.exports = {
  completedExecution,
};
