'use strict';
const _ = require('lodash');

/**
 * Handler class for RESTAPI handlers : JOBMANAGER
 * @property {CementHelper} cementHelper - cementHelper from a cta-restapi Brick
 */
class JobManagerHandler {
  /**
   *
   * @param {CementHelper} cementHelper - cementHelper from a cta-restapi Brick
   */
  constructor(cementHelper) {
    this.cementHelper = cementHelper;
    this.dataType = 'execution';
  }

  /**
   * Publishes request params (Query) id in an execution-cancel Context
   * @param req
   * @param res
   * @param next
   */
  cancelExecution(req, res, next) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: this.dataType,
        quality: 'cancel',
      },
      payload: {
        execution: {
          id: req.params.id
        }
      },
    };
    const context = this.cementHelper.createContext(data);
    context.once('done', function(brickname, response) {
      if (response) {
        res.send(response);
      } else {
        res.status(404).send('Schedule not found.');
      }
    });
    context.once('reject', function(brickname, error) {
      res.status(400).send(error);
    });
    context.once('error', function(brickname, error) {
      res.status(400).send(error);
    });
    context.publish();
  }

}

module.exports = JobManagerHandler;
