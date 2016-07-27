'use strict';

const chai = require('chai');
const expect = chai.expect;

const Instance = require('../../../lib/objects/instance');

describe('Instance', () => {
  const instancePhysicalData = {
    id: '12345566789',
    hostname: 'hostname1',
    ip: '10.0.0.1',
    type: 'physical',
    properties: [{
      name: 'testname1',
      value: 'testvalue1',
    }],
  };
  const instanceCloudData = {
    id: '12345566789',
    hostname: 'hostname1',
    ip: '10.0.0.1',
    type: 'cloud',
    properties: [{
      name: 'testname1',
      value: 'testvalue1',
    }],
    instancetemplate: {},
  };

  describe('validation', () => {
    describe('Physical type', () => {
      it('should create correctly', () => {
        const instance = new Instance(instancePhysicalData);

        expect(instance).to.have.property('id', instancePhysicalData.id);
        expect(instance).to.have.property('hostname', instancePhysicalData.hostname);
        expect(instance).to.have.property('ip', instancePhysicalData.ip);
        expect(instance).to.have.property('type', instancePhysicalData.type);
        expect(instance).to.have.property('properties', instancePhysicalData.properties);

        expect(instance).to.have.property('instancetemplate', undefined);
      });
    });
    describe('Cloud type', () => {
      it('should create correctly', () => {
        const instance = new Instance(instancePhysicalData);

        expect(instance.id).eql(instancePhysicalData.id);
        expect(instance.hostname).eql(instancePhysicalData.hostname);
        expect(instance.ip).eql(instancePhysicalData.ip);
        expect(instance.type).eql(instancePhysicalData.type);
        expect(instance.properties).eql(instancePhysicalData.properties);

        expect(instance.instancetemplate).eql(instancePhysicalData.instancetemplate);
      });
    });
  });

  describe('toJSON', () => {
    describe('Physical type', () => {
      it('should return correct JSON', () => {
        const instance = new Instance(instancePhysicalData);
        const instaceJSON = instance.toJSON();
        expect(instaceJSON).eql(instancePhysicalData);

        expect(instaceJSON).to.not.have.property('instancetemplate');
      });
    });
    describe('Cloud type', () => {
      it('should return correct JSON', () => {
        const instance = new Instance(instanceCloudData);
        const instaceJSON = instance.toJSON();
        expect(instaceJSON).eql(instanceCloudData);

        expect(instaceJSON).to.have.property('instancetemplate');
      });
    });
  });
});
