'use strict';

const completedExecution = {
  'scenario': {
    'id': '1111111111',
    'name': 'testScenario',
    'description': 'Test scenario',
    'scopetested': '',
    'testsuites': [{'id': '1231231232', 'name': 'testTestSuite', 'applicationtested': '', 'parent': ''}],
    'configuration': {
      'id': '1232131232',
      'name': 'testConfig',
      'targetmode': '',
      'runmode': 'mono',
      'type': 'physical',
      'properties': [{'name': 'testname', 'value': 'testvalue'}]
    },
    'pendingtimeout': 1000,
    'runningtimeout': 1000,
    'scheduled': true
  },
  'user': {},
  'createdAt': '2016-07-28T15:51:05.539Z',
  'updatedAt': '2016-07-28T15:51:05.657Z',
  'id': 22,
  'instances': [{
    'hostname': 'bhabah',
    'ip_address': '1.1.1.1',
    'os': 'windows7',
    'agent_version': '4.3.2',
    'created_date': '03-01-2016 16:05:10.111z',
    'modified_date': '11-06-2016 11:00:01.222z',
    'sw': [
      {'name': 'Office', 'version': '97'},
      {'name': 'vnc', 'version': '1.1.1'},
    ],
  }],
};

module.exports = {
  completedExecution,
};
