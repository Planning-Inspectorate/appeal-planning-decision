const Documents = require('../schemas/documents');
const blobStorage = require('./blobStorage');
const logger = require('./logger');

const getDocuments = () => Documents.find();

const mapMetadata = ({ applicationId, name, uploadDate, id, size, mimeType }) => ({
  application_id: applicationId,
  name,
  upload_date: new Date(uploadDate).toISOString(),
  mime_type: mimeType,
  location: `${applicationId}/${id}/${name}`,
  size: String(size),
  id,
});

const saveMetadata = async (metadata) => {
  try {
    const containerClient = await blobStorage.initContainerClient();
    const isSaved = await blobStorage.saveMetadata(containerClient, metadata);
    return isSaved;
  } catch (err) {
    logger.error({ err }, 'Error saving blob storage metadata for document');
    throw err;
  }
};

const migrateMetadata = async () => {
  const migratedDocuments = [];
  const failedDocuments = [];

  try {
    const documents = await getDocuments();

    for (let inc = 0; inc < documents.length; inc += 1) {
      const cosmosDbMetadata = documents[inc];

      try {
        const blobStorageMetadata = mapMetadata(cosmosDbMetadata);
        // eslint-disable-next-line no-await-in-loop
        await saveMetadata(blobStorageMetadata);

        migratedDocuments.push({
          cosmosDbMetadata,
          blobStorageMetadata,
        });
      } catch (err) {
        failedDocuments.push({
          documentId: cosmosDbMetadata.id,
          message: err.message,
        });
      }
    }

    return {
      documentsFound: documents.length,
      documentsMigrated: migratedDocuments.length,
      documentsFailed: failedDocuments.length,
      migratedDocuments,
      failedDocuments,
    };
  } catch (err) {
    logger.error({ err }, 'Error migrating metadata');
    throw err;
  }
};

module.exports = {
  getDocuments,
  mapMetadata,
  saveMetadata,
  migrateMetadata,
};
