'use strict';

let config = {};

/**
 * getExecutionsUrl - get execution url from config
 *
 * @return {string} url
 */
function getExecutionsUrl() {
  if (/.\/$/.test(config.executionsUrl)) {
    return config.executionsUrl.slice(0, -1);
  }
  return config.executionsUrl;
}
/**
 * getInstancesUrl - get instance url from config
 *
 * @return {string} url
 */
function getInstancesUrl() {
  if (/.\/$/.test(config.instancesUrl)) {
    return config.instancesUrl.slice(0, -1);
  }
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
