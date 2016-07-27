'use strict';

const chai = require('chai');
const expect = chai.expect;

const Scenario = require('../../../lib/objects/scenario');

describe('Scenario', () => {
  const scenarioData = {
    id: '12345566789',
    name: 'testScenario',
    description: 'Test scenario',
    scopetested: '',
    testsuites: [{ id: '', name: '', applicationtested: '', parent: '' }],
    configuration: { id: '', name: '', targetmode: '', runmode: '' },
    pendingtimeout: 1000,
    runningtimeout: 1000,
    scheduled: true,
  };
  describe('validation', () => {
    it('should create correctly', () => {
      const scenario = new Scenario(scenarioData);

      expect(scenario).to.have.property('id', scenarioData.id);
      expect(scenario).to.have.property('name', scenarioData.name);
      expect(scenario).to.have.property('description', scenarioData.description);
      expect(scenario).to.have.property('scopetested', scenarioData.scopetested);
      expect(scenario).to.have.property('testsuites', scenarioData.testsuites);
      expect(scenario).to.have.property('configuration', scenarioData.configuration);
      expect(scenario).to.have.property('pendingtimeout', scenarioData.pendingtimeout);
      expect(scenario).to.have.property('runningtimeout', scenarioData.runningtimeout);
      expect(scenario).to.have.property('scheduled', scenarioData.scheduled);

      expect(scenario).to.have.property('schedule', scenarioData.schedule);
      expect(scenario).to.have.property('scheduletimestamp', scenarioData.scheduletimestamp);
      expect(scenario).to.have.property('afterhandlers', scenarioData.afterhandlers);
    });

    function testRequiredField(field) {
      return function testFunction() {
        const cloneScenarioData = Object.assign({}, scenarioData);
        delete cloneScenarioData[field];
        expect(() => {
          /* eslint-disable no-new */
          new Scenario(cloneScenarioData);
          /* eslint-enable no-new */
        }).to.throw(Error, `${field} is required`);
      };
    }

    it('should required id field', testRequiredField('id'));
    it('should required name field', testRequiredField('name'));
    it('should required description field', testRequiredField('description'));
    it('should required scopetested field', testRequiredField('scopetested'));
    it('should required testsuites field', testRequiredField('testsuites'));
    it('should required configuration field', testRequiredField('configuration'));
    it('should required pendingtimeout field', testRequiredField('pendingtimeout'));
    it('should required runningtimeout field', testRequiredField('runningtimeout'));
    it('should required scheduled field', testRequiredField('scheduled'));

    describe('testsuites', () => {
      it('should be an array', () => {
        const cloneScenarioData = Object.assign({}, scenarioData);
        cloneScenarioData.testsuites = {};
        expect(() => {
          /* eslint-disable no-new */
          new Scenario(cloneScenarioData);
          /* eslint-enable no-new */
        }).to.throw(Error, 'testsuites should be an array');
      });

      function testTestsuitesRequiredField(field) {
        return function testFunction() {
          const cloneScenarioData = JSON.parse(JSON.stringify(scenarioData));
          delete cloneScenarioData.testsuites[0][field];
          expect(() => {
            /* eslint-disable no-new */
            new Scenario(cloneScenarioData);
            /* eslint-enable no-new */
          }).to.throw(Error, `testsuite.${field} is required.`);
        };
      }

      it('should required id field', testTestsuitesRequiredField('id'));
      it('should required name field', testTestsuitesRequiredField('name'));
      const testApplicationTested = testTestsuitesRequiredField('applicationtested');
      it('should required applicationtested field', testApplicationTested);
      it('should required parent field', testTestsuitesRequiredField('parent'));
    });

    describe('configuration', () => {
      it('should be an object', () => {
        const cloneScenarioData = JSON.parse(JSON.stringify(scenarioData));
        cloneScenarioData.configuration = [];
        expect(() => {
          /* eslint-disable no-new */
          new Scenario(cloneScenarioData);
          /* eslint-enable no-new */
        }).to.throw(Error, 'configuration should be a object');
      });

      function testConfigurationRequiredField(field) {
        return function testFunction() {
          const cloneScenarioData = JSON.parse(JSON.stringify(scenarioData));
          delete cloneScenarioData.configuration[field];
          expect(() => {
            /* eslint-disable no-new */
            new Scenario(cloneScenarioData);
            /* eslint-enable no-new */
          }).to.throw(Error, `configuration.${field} is required.`);
        };
      }

      it('should required id field', testConfigurationRequiredField('id'));
      it('should required name field', testConfigurationRequiredField('name'));
      it('should required targetmode field', testConfigurationRequiredField('targetmode'));
      it('should required runmode field', testConfigurationRequiredField('runmode'));
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON', () => {
      const scenario = new Scenario(scenarioData);
      expect(scenario.toJSON()).eql(scenarioData);
    });
  });
});
