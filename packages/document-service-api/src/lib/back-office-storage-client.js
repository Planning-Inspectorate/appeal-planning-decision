const BlobClient = require('@pins/common/src/client/blob-storage-client');
const config = require('#config/config');

const blobClient = new BlobClient(config.boStorage.host, config.boStorage.connectionString);

module.exports = blobClient;
