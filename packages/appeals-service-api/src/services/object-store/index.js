const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('../../configuration/config');
const logger = require('../../lib/logger');

// Slap this in common, remove the one from document-service-api/src/lib/blobStorage.js

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

const blobMetaGetter = (initContainerClient) => {
	const containerClient = initContainerClient(config);
	return (location) =>
		new Promise((resolve) => {
			containerClient.then((containerClient) => {
				const blobClient = containerClient.getBlobClient(location);
				resolve(blobClient.getProperties());
			});
		});
};
module.exports = {
	initContainerClient,
	blobMetaGetter
};
