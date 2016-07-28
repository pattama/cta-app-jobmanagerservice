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
