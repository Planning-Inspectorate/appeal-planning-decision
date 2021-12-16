const logger = require('../lib/logger');
const clamd = require('../lib/clamd');

const processFile = async (req, res) => {
  const { file } = req?.files;

  if (typeof file === 'undefined') {
    logger.warn('file is not defined');
    return res.sendStatus(400);
  }

  try {
    const [uploadedFile] = file;
    logger.info('sending file to clamav', { controller: 'processFile' });
    const result = await clamd.sendFile(uploadedFile.buffer);
    return res.send(result);
  } catch (error) {
    logger.error(error, 'error uploading file to clamav');
    return res.send('error uploading file to clamav');
  }
};

module.exports = {
  processFile,
};
