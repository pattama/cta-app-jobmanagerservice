'use strict';
const appRootPath = require('app-root-path').path;
const path = require('path');
const FlowControlUtils = require('./flowcontrol');

class BusinessLogicsUtils {
  static get BusinessLogicsPath() {
    return path.join(appRootPath,
      '/lib/bricks/businesslogics/');
  }
  static get HelperPath() {
    return path.join(BusinessLogicsUtils.BusinessLogicsPath,
      '/jobmanager/helpers');
  }
  static createHelper(helperClassName) {
    // eslint-disable-next-line
    const Helper = require(path.join(BusinessLogicsUtils.HelperPath, helperClassName));
    return new Helper(FlowControlUtils.defaultCementHelper, FlowControlUtils.defaultLogger);
  }
  static createMessenger() {
    // eslint-disable-next-line
    const Messenger = require(path.join(BusinessLogicsUtils.BusinessLogicsPath, '/jobmanager/messenger'));
    return new Messenger(FlowControlUtils.defaultCementHelper, FlowControlUtils.defaultLogger);
  }
}

module.exports = BusinessLogicsUtils;
