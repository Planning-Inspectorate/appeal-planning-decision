const uuid = require('uuid');

module.exports = class Appeals {
  generateId() {
    this.set('id', uuid.v4());
    return this;
  }

  toDTO() {
    return {
      ...this.toObject(),
      _id: undefined,
    };
  }
};
