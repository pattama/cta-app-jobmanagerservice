'use strict';

const nock = require('nock');
const httpStatus = require('http-status');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const instances = require('../.././instances');
const configHelper = require('../.././config_helper');

const sinon = require('sinon');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Instances', () => {
  describe('getMatchingInstances', () => {
    let sandbox;
    const instancesUrl = 'http://abc.com/instances';
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getInstancesUrl').returns(instancesUrl);
    });

    afterEach(() => {
      sandbox.restore();
      nock.cleanAll();
    });

    it('should throw error if no properties query', () => {
      const testData = { };

      return expect(instances.getMatchingInstances(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.err).to.not.be.a('null');
        });
    });
    it('should get successfully if there are any property query', () => {
      const matchingData = {
        type: 'physical',
        properties: [
          {
            name: 'testname1',
            value: 'testvalue1',
          },
        ],
      };
      const respData = [
        { hostname: 'hostname1' },
        { hostname: 'hostname2' },
      ];
      const nockInstancesGetReq = nock(instancesUrl)
        .post('/matchingInstances', matchingData)
        .reply(httpStatus.OK, respData);
      return expect(instances.getMatchingInstances(matchingData))
        .to.be.fulfilled.and.then((result) => {
          expect(result).to.be.deep.equal(respData);
          expect(nockInstancesGetReq.isDone()).equal(true);
        });
    });

    describe('Errors', () => {
      it('should handle httpStatus 500+ error', () => {
        const matchingData = {
          type: 'physical',
          properties: [
            {
              name: 'testname1',
              value: 'testvalue1',
            },
          ],
        };
        const nockExecutionPostReq = nock(instancesUrl)
          .post('/matchingInstances', matchingData)
          .reply(httpStatus.INTERNAL_SERVER_ERROR);

        return expect(instances.getMatchingInstances(matchingData))
          .to.be.rejected.and.then((reason) => {
            expect(reason.statusCode).equal(httpStatus.INTERNAL_SERVER_ERROR);

            expect(nockExecutionPostReq.isDone()).equal(true);
          });
      });

      it('should handle httpStatus 400+ error', () => {
        const matchingData = {
          type: 'physical',
          properties: [
            {
              name: 'testname1',
              value: 'testvalue1',
            },
          ],
        };
        const nockExecutionPostReq = nock(instancesUrl)
          .post('/matchingInstances', matchingData)
          .reply(httpStatus.BAD_REQUEST);

        return expect(instances.getMatchingInstances(matchingData))
          .to.be.rejected.and.then((reason) => {
            expect(reason.statusCode).equal(httpStatus.BAD_REQUEST);

            expect(nockExecutionPostReq.isDone()).equal(true);
          });
      });

      it('should handle error', () => {
        const matchingData = {
          type: 'physical',
          properties: [
            {
              name: 'testname1',
              value: 'testvalue1',
            },
          ],
        };
        const nockExecutionPostReq = nock(instancesUrl)
          .post('/matchingInstances', matchingData)
          .replyWithError({ code: 'ECONNRESET' });

        return expect(instances.getMatchingInstances(matchingData))
          .to.be.rejected.and.then((reason) => {
            expect(reason.code).equal('ECONNRESET');

            expect(nockExecutionPostReq.isDone()).equal(true);
          });
      });
    });
  });
});
