/**
 * Upload Files To Blob Storage
 *
 * This gets the un-uploaded files and pushes them
 * to Blob Storage
 */

const { functional } = require('@pins/common');
const Documents = require('../schemas/documents');
const logger = require('../lib/logger');
const {
  connectToBlobStorage,
  uploadToBlobStorage,
  deleteFromBlobStorage,
} = require('../lib/blobStorage');

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

const uploadDocumentsToBlobStorage = async (docs) => {
  logger.info('Starting upload process');

  const { containerClient } = await connectToBlobStorage();

  const data = await functional.flow([
    incrementAttempts,
    uploadToBlobStorage(containerClient),
    updateUploadStatus,
  ])(docs);

  logger.debug({ data }, 'Functional programming flow finished');

  logger.info({ data }, 'Upload process finished');

  return data;
};

const deleteFromBlobStorageByLocation = async (document) => {
  logger.info(`Deleting ${document}`);
  return deleteFromBlobStorage(document);
};

module.exports = {
  uploadDocumentsToBlobStorage,
  deleteFromBlobStorageByLocation,
};
