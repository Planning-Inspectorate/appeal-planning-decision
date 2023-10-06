const { BlobServiceClient } = require('@azure/storage-blob');

/**
 * @param {String} containerName - name of the container
 * @param {String} blobName - name of the blob
 * @param {String|undefined} [connectionString] - connection string for the storage account,
 * @returns {Promise.<NodeJS.ReadableStream>} a node js readable *webstream* of the file
 */
async function downloadBlob(containerName, blobName, connectionString) {
	// get connection string from function app storage account
	if (!connectionString) {
		if (!process.env.AzureWebJobsStorage) {
			throw new Error('Could not retrive default function app connectionString');
		}

		connectionString = process.env.AzureWebJobsStorage;
	}

	// get blob client
	const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blobClient = containerClient.getBlobClient(blobName);

	// return a readable stream of the blob
	const response = await blobClient.download();

	if (response.readableStreamBody) {
		return response.readableStreamBody;
	}

	throw new Error(`Failed to download blob: ${containerName}/${blobName}`);
}

module.exports = { downloadBlob };
