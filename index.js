'use strict'

const FlowControl = require('cta-flowcontrol');
const Cement = FlowControl.Cement;
// const config = require('./config_half1');
// const config = require('./config_half2');
const config = require('./cement.config');
// const config = require('./config.silo');
// const config = require('./config.jobbroker');
// const config = require('./config.translator');
const cement = new Cement(config);

