const uuid = require('uuid');
const { connectToBlobStorage, downloadFromBlobStorage } = require('../lib/blobStorage');

module.exports = class Appeals {
  async downloadFileBuffer() {
    return downloadFromBlobStorage(this.get('blobStorageLocation'), await connectToBlobStorage());
  }

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
