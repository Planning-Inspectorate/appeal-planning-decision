const {
    azure: {
        BLOB_STORAGE_CONNECTION_STRING,
        BLOB_STORAGE_CONTAINER_NAME
    }
} = require('./config');
const {
    BlobServiceClient,
} = require('@azure/storage-blob');

const client = BlobServiceClient
    .fromConnectionString(BLOB_STORAGE_CONNECTION_STRING);
const containerClient = client
    .getContainerClient(BLOB_STORAGE_CONTAINER_NAME);
const createClient = async () => {
    await containerClient.create();
}

createClient()

module.exports = containerClient