const { BlobServiceClient } = require('@azure/storage-blob');
const streams = require('memory-streams');
const path = require('path');
const logger = require('./logger');
const config = require('./config');

const initContainerClient = async () => {
  logger.info('Connecting to blob storage');

  const { connectionString, container } = config.storage;

  let containerClient;

  try {
    const blobClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobClient.getContainerClient(container);
    logger.info({ container }, 'Creating container if not present');
    await containerClient.createIfNotExists();
    logger.info('Successfully connected to blob storage');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to blob storage');
    throw err;
  }

  return containerClient;
};

const downloadFile = (containerClient, location) => {
  try {
    logger.info({ location }, 'Downloading file from blob storage');
    return containerClient.getBlobClient(location).downloadToBuffer();
  } catch (err) {
    logger.error({ err }, 'Failed to download file from blob storage');
    throw err;
  }
};

const uploadFile = async (containerClient, document) => {
  const metadata = { ...document };
  const filePath = path.join(config.fileUpload.path, metadata.filename);
  const blobName = metadata.location;

  delete metadata.filename;

  try {
    logger.info({ blobName, metadata, filePath }, 'Uploading file to blob storage');
    const reader = new streams.ReadableStream(document.buffer.toString('base64'));

    const uploadStatus = await containerClient
      .getBlockBlobClient(blobName)
      .uploadStream(reader, undefined, undefined, {
        blobHTTPHeaders: {
          blobContentType: metadata.mime_type,
        },
        metadata,
      });

    logger.info({ metadata, uploadStatus }, 'File successfully uploaded');

    return metadata;
  } catch (err) {
    logger.error({ err, metadata }, 'File upload failed');
    throw err;
  }
};

const deleteFile = async (containerClient, location) => {
  try {
    await containerClient.getBlockBlobClient(location).delete();
    return true;
  } catch (err) {
    logger.error({ err }, 'Error deleting document from blob storage');
    throw err;
  }
};

const getMetadataForAllFiles = async (containerClient, applicationId) => {
  try {
    const blobs = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const blob of containerClient.listBlobsFlat({ prefix: applicationId })) {
      blobs.push(blob);
    }

    return blobs;
  } catch (err) {
    logger.error({ err }, 'Error listing blobs');
    throw err;
  }
};

const getMetadataForSingleFile = async (containerClient, applicationId, documentId) => {
  try {
    const blobs = await getMetadataForAllFiles(containerClient, applicationId);
    const files = blobs.filter(({ metadata = {} }) => metadata.id === documentId);
    return files.length ? files[0] : null;
  } catch (err) {
    logger.error({ err }, 'Error getting blob');
    throw err;
  }
};

const saveMetadata = async (containerClient, metadata) => {
  try {
    logger.info({ metadata }, 'Setting file metadata');
    await containerClient.getBlobClient(metadata.location).setMetadata(metadata);
    return true;
  } catch (err) {
    logger.error({ err }, 'Failed to set file metadata');
    const migrateError = {
      ...err,
      message: `Failed to migrate document ${metadata.id} - ${err.message}`,
    };
    throw migrateError;
  }
};

module.exports = {
  initContainerClient,
  downloadFile,
  uploadFile,
  deleteFile,
  getMetadataForAllFiles,
  getMetadataForSingleFile,
  saveMetadata,
};
