const config = require('../../config');

function isCreate(context) {
  const nature = context.data.nature;
  return nature.type === config.create.type &&
    nature.quality === config.create.quality;
}

function isStop(context) {
  const nature = context.data.nature;
  return nature.type === config.stop.type &&
    nature.quality === config.stop.quality;
}


/**
 * getExecutionUrl - get execution url from config
 *
 * @return {string} url
 */
function getExecutionUrl() {
  return config.executionUrl;
}
function getInstancesUrl() {
  return config.instancesUrl;
}

// noinspection JSLastCommaInObjectLiteral
module.exports = {
  isCreate,
  isStop,
  getExecutionUrl,
  getInstancesUrl,
};
