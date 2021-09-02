const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const config = require('./config');

const deleteLocalFile = async (file) => {
  const { fileUpload } = config;
  const { filename } = file;
  const filePath = path.join(fileUpload.path, filename);

  try {
    logger.info({ file, filePath }, 'Deleting local file');
    await fs.promises.unlink(filePath);
    logger.info({ file, filePath }, 'Deleted local file');
  } catch (err) {
    logger.error({ err, file }, 'Error deleting local file');
    throw err;
  }
};

module.exports = deleteLocalFile;
