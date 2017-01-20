'use strict';

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
    this.dataType = 'executions';
  }

  /**
   * Redirect to cancel/timeout method
   * @param req
   * @param {string} req.body.action - cancel|timeout
   * @param res
   */
  actions(req, res) {
    const body = req.body;
    if (!body.hasOwnProperty('action') || typeof body.action !== 'string') {
      res.status(400).send('missing/incorrect action string in body');
    } else {
      switch (req.body.action) {
        case 'cancel':
          this.cancel(req, res);
          break;
        case 'timeout':
          this.timeout(req, res);
          break;
        default:
          res.status(400).send(`action '${req.body.action} is not supported.'`);
          break;
      }
    }
  }

  /**
   * Publishes request params in an execution-cancel Context
   * @param req
   * @param {string} req.params.id - execution ID
   * @param {Array.<Instance>} req.params.instances - array of instances
   * @param res
   */
  cancel(req, res) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: this.dataType,
        quality: 'cancel',
      },
      payload: {
        execution: {
          id: req.params.id,
          instances: req.body.instances,
        },
      },
    };
    const context = this.cementHelper.createContext(data);
    context.once('done', (brickName, response) => {
      res.send(response);
    });
    context.once('reject', (brickName, error) => {
      res.status(400).send(error.message);
    });
    context.once('error', (brickName, error) => {
      res.status(400).send(error.message);
    });
    context.publish();
  }

  /**
   * Publishes request params in an execution-timeout Context
   * @param req
   * @param {string} req.params.id - execution ID
   * @param {Array.<Instance>} req.params.instances - array of instances
   * @param res
   */
  timeout(req, res) { // eslint-disable-line no-unused-vars
    const data = {
      nature: {
        type: this.dataType,
        quality: 'timeout',
      },
      payload: {
        execution: {
          id: req.params.id,
          instances: req.body.instances,
        },
      },
    };
    const context = this.cementHelper.createContext(data);
    context.once('done', (brickName, response) => {
      res.send(response);
    });
    context.once('reject', (brickName, error) => {
      res.status(400).send(error.message);
    });
    context.once('error', (brickName, error) => {
      res.status(400).send(error.message);
    });
    context.publish();
  }

}

module.exports = JobManagerHandler;
