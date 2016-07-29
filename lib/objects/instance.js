// id:ObjectId
// hostname:String
// ip:String
// type:physical
// properties:[{
//   name:'propName',
//   value:'propValue'
// }]
// type:cloud
// instancetemplate:ObjectId(InstanceTemplate)

'use strict';

const _ = require('lodash');

class Instance {
  constructor(data) {
    this.id = data.id;
    this.hostname = data.hostname;
    this.ip = data.ip;
    this.type = data.type;
    this.properties = data.properties;
    this.instancetemplate = data.instancetemplate;
  }

  toJSON() {
    const constructJSON = {
      id: this.id,
      hostname: this.hostname,
      ip: this.ip,
      type: this.type,
      properties: this.properties,
    };

    if (this.type === 'cloud') {
      constructJSON.instancetemplate = this.instancetemplate;
    }

    return _.omitBy(constructJSON, _.isNil);
  }
}

module.exports = Instance;
