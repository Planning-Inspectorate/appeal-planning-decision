const { BlobServiceClient } = require('@azure/storage-blob');
const logger = require('./lib/logger');

/**
 * @type {Map<string, import('@azure/storage-blob').ContainerClient>}
 */
const clientsMap = new Map();

const initContainerClient = async (config) => {
	logger.info('Connecting to blob storage');

	const { connectionString, container } = config.storage;

	if (clientsMap.has(connectionString)) {
		return clientsMap.get(connectionString);
	}

	try {
		const blobClient = BlobServiceClient.fromConnectionString(connectionString);
		const containerClient = blobClient.getContainerClient(container);

		logger.info({ container }, 'Creating container if not present');
		await containerClient.createIfNotExists();

		logger.info('Successfully connected to blob storage');
		clientsMap.set(connectionString, containerClient);
		return containerClient;
	} catch (err) {
		logger.error({ err }, 'Failed to connect to blob storage');
		throw err;
	}
};

module.exports = {
	initContainerClient
};
