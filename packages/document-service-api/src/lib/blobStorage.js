/* istanbul ignore file */

const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const config = require('./config');

let containerClient;
let blobClient;

/**
 * Connect To Blob Storage
 *
 * Connects the blob storage
 *
 * @returns {Promise<{blobClient: BlobServiceClient, containerClient: ContainerClient}>}
 */
const connectToBlobStorage = async () => {
  logger.info('Connecting to blob storage');

  if (!containerClient) {
    try {
      /* Configure Blob Storage client */
      blobClient = BlobServiceClient.fromConnectionString(config.storage.connectionString);
      containerClient = blobClient.getContainerClient(config.storage.container);
      logger.info({ container: config.storage.container }, 'Creating container if not present');
      await containerClient.createIfNotExists();
      logger.info('Successfully connected to blob storage');
    } catch (err) {
      logger.error({ err }, 'Failed to connect to blob storage');
      /* Preserve the error */
      throw err;
    }
  }
  return { blobClient, containerClient };
};

/**
 * Upload To Blob Storage
 *
 * Uploads each of the selected documents to blob storage
 *
 * @param blobStorageClient
 * @returns {function(*): Promise<unknown[]>}
 */
const uploadToBlobStorage = (blobStorageClient) => {
  return (docs) =>
    Promise.all(
      docs.map(async (doc) => {
        let uploaded = false;
        const filePath = path.join(config.fileUpload.path, doc.location);

        try {
          const blobName = doc.blobStorageLocation;
          logger.info({ blobName, doc, filePath }, 'Uploading file to blob storage');

          const blockBlobClient = blobStorageClient.getBlockBlobClient(blobName);
          const readableStream = fs.createReadStream(filePath);
          const uploadStatus = await blockBlobClient.uploadStream(
            readableStream,
            undefined,
            undefined,
            {
              blobHTTPHeaders: {
                blobContentType: doc.mimeType,
              },
            }
          );

          uploaded = true;
          logger.info({ doc, uploadStatus }, 'File successfully uploaded');
        } catch (err) {
          logger.error({ err, doc }, 'File upload failed');
        }

        /* Housekeeping job - this doesn't affect the process */
        try {
          logger.info({ doc, filePath }, 'Deleting local document');

          await fs.promises.unlink(filePath);

          logger.info({ doc, filePath }, 'Deleted uploaded document');
        } catch (err) {
          logger.error({ err, doc }, 'Error deleting document');
        }

        return {
          uploaded,
          doc,
        };
      })
    );
};

module.exports = {
  connectToBlobStorage,
  uploadToBlobStorage,
};
