/**
 * Upload Files To Blob Storage
 *
 * This gets the un-uploaded files and pushes them
 * to Blob Storage
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { functional } = require('@pins/common');
const { BlobServiceClient } = require('@azure/storage-blob');
const Documents = require('../schemas/documents');
const config = require('../lib/config');
const logger = require('../lib/logger');
const bootstrap = require('../lib/mongooseBootstrap');

/**
 * Connect To Blob Storage
 *
 * Connects the blob storage
 *
 * @returns {Promise<{blobClient: BlobServiceClient, containerClient: ContainerClient}>}
 */
async function connectToBlobStorage() {
  logger.info('Connecting to blob storage');

  try {
    /* Configure Blob Storage client */
    const blobClient = BlobServiceClient.fromConnectionString(config.storage.connectionString);
    const containerClient = blobClient.getContainerClient(config.storage.container);

    logger.info({ container: config.storage.container }, 'Creating container if not present');

    await containerClient.createIfNotExists();

    logger.info('Successfully connected to blob storage');

    return {
      blobClient,
      containerClient,
    };
  } catch (err) {
    logger.error({ err }, 'Failed to connect to blob storage');

    /* Preserve the error */
    throw err;
  }
}

/**
 * Get Files To Process
 *
 * Returns an array of objects to process, with the
 * oldest first.
 *
 * @returns {Promise<*>}
 */
async function getFilesToProcess() {
  try {
    logger.info('Getting files to process');

    const files = await Documents.find({
      'upload.processed': false,
      'upload.processAttempts': {
        $lt: config.storage.processMaxAttempts,
      },
    })
      .limit(config.storage.processQueryLimit)
      .sort({ createdAt: 1 });

    logger.info({ files, count: files.length }, 'Files found');

    return files;
  } catch (err) {
    logger.error({ err }, 'Error getting files to process');

    throw err;
  }
}

/**
 * Increment Attempts
 *
 * Increments an attempt at uploading a file in
 * the database
 *
 * @param docs
 * @returns {Promise<unknown[]>}
 */
async function incrementAttempts(docs) {
  const docList = await Promise.all(
    docs.map(async (item) => {
      logger.info({ id: item.id }, 'Incrementing a process attempt');

      try {
        await Documents.findOneAndUpdate(
          { id: item.id },
          {
            $inc: {
              'upload.processAttempts': 1,
            },
          }
        );
      } catch (err) {
        logger.error({ err }, 'Error incrementing a process attempt - file will not be processed');
        return false;
      }

      return item;
    })
  );

  /* Remove anything that's errored */
  return docList.filter((item) => item);
}

/**
 * Upload To Blob Storage
 *
 * Uploads each of the selected documents to blob storage
 *
 * @param blobStorageClient
 * @returns {function(*): Promise<unknown[]>}
 */
function uploadToBlobStorage(blobStorageClient) {
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
}

/**
 * Update Upload Status
 *
 * Updates the upload status and deletes the local file
 *
 * @param docs
 * @returns {Promise<unknown[]>}
 */
async function updateUploadStatus(docs) {
  return Promise.all(
    docs.map(async ({ uploaded, doc }) => {
      if (uploaded) {
        try {
          /* File has been uploaded - update the database */
          return await Documents.findOneAndUpdate(
            { id: doc.id },
            {
              'upload.processed': true,
            },
            {
              new: true,
            }
          );
        } catch (err) {
          logger.error({ err }, 'Failed to update upload state');
        }
      }

      return docs;
    })
  );
}

async function main() {
  logger.info({ config }, 'Starting upload process');

  await bootstrap();

  const { containerClient } = await connectToBlobStorage();

  const data = await functional.flow([
    incrementAttempts,
    uploadToBlobStorage(containerClient),
    updateUploadStatus,
  ])(await getFilesToProcess());

  logger.debug({ data }, 'Functional programming flow finished');

  logger.info({ data }, 'Upload process finished');

  /* Close mongoose connection */
  await mongoose.connection.close();

  logger.info('Mongoose connect closed');
}

main()
  .then(() => {
    logger.info('Bye');
    process.exit(0);
  })
  .catch(async (err) => {
    logger.fatal({ err }, 'Upload service errored');
    process.exit(1);
  });
