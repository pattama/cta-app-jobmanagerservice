/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

let config = {};

/**
 * getExecutionsUrl - get execution url from config
 *
 * @return {string} url
 */
function getExecutionsUrl() {
  return config.executionsUrl;
}
/**
 * getInstancesUrl - get instance url from config
 *
 * @return {string} url
 */
function getInstancesUrl() {
  return config.instancesUrl;
}

function setConfig(newConfig) {
  config = Object.assign({}, newConfig);
}

module.exports = {
  getExecutionsUrl,
  getInstancesUrl,
  setConfig,
};
