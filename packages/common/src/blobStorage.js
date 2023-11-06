const { BlobServiceClient } = require('@azure/storage-blob');
const logger = require('./lib/logger');

const initContainerClient = async (config) => {
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

module.exports = {
	initContainerClient
};
