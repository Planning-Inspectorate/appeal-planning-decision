const NodeClam = require('clamscan');
const { Readable } = require('stream');
const config = require('./config');
const logger = require('./logger');

const createClient = async () => {
  logger.info('creating client');

  const client = new NodeClam().init({
    removeInfected: true,
    clamdscan: {
      host: config.services.clamav.host || 'localhost',
      port: config.services.clamav.port || 3310,
      bypass_test: true,
    },
    preference: 'clamdscan',
  });

  return client;
};

const sendFile = async (file) => {
  if (typeof file === 'undefined') {
    throw new Error('invalid or empty file');
  }

  logger.info('sending file');

  const client = await createClient();
  const readableStream = Readable.from(file.toString());
  return client.scanStream(readableStream);
};

module.exports = {
  sendFile,
  createClient,
};
