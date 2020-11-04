const uuid = require('uuid');

module.exports = class AppealsMethods {
  generateUUID() {
    this.set('uuid', uuid.v4());
  }
};
