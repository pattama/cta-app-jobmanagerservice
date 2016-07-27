const instances = require('../../../lib/instances');
const configHelper = require('../../../lib/helpers/config.helper');
const nock = require('nock');
const httpStatus = require('http-status');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const sinon = require('sinon');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Instances', () => {
  describe('sendPostRequest', () => {
    it('should create successfully', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getInstancesUrl').returns('http://abc.com/instances');
      const testData = { test: 'test' };
      const nockInstancesPostReq = nock(configHelper.getInstancesUrl())
        .post('', testData)
        .reply(httpStatus.CREATED, {
          type: 'instances',
        });

      return expect(instances.sendPostRequest(testData))
        .to.be.fulfilled.and.then((result) => {
          expect(result.statusCode).equal(httpStatus.CREATED);
          expect(result.instances).eql({ type: 'instances' });

          expect(nockInstancesPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });

    it('should handle httpStatus 500+ error', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getInstancesUrl').returns('http://abc.com/instances');
      const testData = { test: 'test' };
      const nockInstancesPostReq = nock(configHelper.getInstancesUrl())
        .post('', testData)
        .reply(httpStatus.INTERNAL_SERVER_ERROR);

      return expect(instances.sendPostRequest(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.statusCode).equal(httpStatus.INTERNAL_SERVER_ERROR);

          expect(nockInstancesPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });

    it('should handle httpStatus 400+ error', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getInstancesUrl').returns('http://abc.com/instances');
      const testData = { test: 'test' };
      const nockInstancesPostReq = nock(configHelper.getInstancesUrl())
        .post('', testData)
        .reply(httpStatus.BAD_REQUEST);

      return expect(instances.sendPostRequest(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.statusCode).equal(httpStatus.BAD_REQUEST);

          expect(nockInstancesPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });

    it('should handle error', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getInstancesUrl').returns('http://abc.com/instances');
      const testData = { test: 'test' };
      const nockInstancesPostReq = nock(configHelper.getInstancesUrl())
        .post('', testData)
        .replyWithError({ code: 'ECONNRESET' });

      return expect(instances.sendPostRequest(testData))
        .to.be.rejected.and.then((reason) => {
          expect(reason.code).equal('ECONNRESET');

          expect(nockInstancesPostReq.isDone()).equal(true);

          sandbox.restore();
        });
    });
  });
  describe('getMatchingInstances', () => {
    // it('should throw error if no properties query', () => {
    //   const sandbox = sinon.sandbox.create();
    //   sandbox.stub(configHelper, 'getInstancesUrl').returns('http://abc.com/instances');
    //   const testData = { };
    //
    //   return expect(instances.getMatchingInstances(testData))
    //     .to.be.rejected.and.then((reason) => {
    //       expect(reason.err).to.be.not.null;
    //       sandbox.restore();
    //     });
    // });
    it('should get successfully if there are any property query', () => {
      const sandbox = sinon.sandbox.create();
      sandbox.stub(configHelper, 'getInstancesUrl').returns('http://abc.com/instances');
      const matchingData = {
        type: 'physical',
        properties: [
          {
            name: 'testname1',
            value: 'testvalue1',
          },
        ],
      };
      const nockInstancesGetReq = nock(configHelper.getInstancesUrl())
        .post('/matchingInstances', matchingData)
        .reply(httpStatus.OK, ['hostname1', 'hostname2']);

      return expect(instances.getMatchingInstances(matchingData))
        .to.be.fulfilled.and.then((result) => {
          expect(result.statusCode).equal(httpStatus.OK);
          expect(result.instances).to.be.an('array');
          expect(nockInstancesGetReq.isDone()).equal(true);
          sandbox.restore();
        });
    });
  });
});
