const uuid = require('uuid');
const { initContainerClient, downloadFile } = require('../lib/blobStorage');

module.exports = class Appeals {
  async downloadFileBuffer() {
    return downloadFile(this.get('blobStorageLocation'), await initContainerClient());
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
