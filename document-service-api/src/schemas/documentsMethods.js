const uuid = require('uuid');

module.exports = class Appeals {
  generateUUID() {
    this.set('uuid', uuid.v4());
  }
};
