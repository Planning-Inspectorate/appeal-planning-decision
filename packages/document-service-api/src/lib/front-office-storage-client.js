const BlobClient = require('@pins/common/src/client/blob-storage-client');
const config = require('#config/config');

const blobClient = new BlobClient(config.storage.host, config.storage.connectionString);

module.exports = blobClient;
