/**
 * This file allows integration tests to spin up an Azurite container to provide document (BLOB) storage
 * functionality in as much of a production-like sense as possible!
 *
 * Code here is informed by the official Azurite docs which can be found here:
 * https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=docker-hub#command-line-options
 */
import { BlobServiceClient, ContainerClient, BlobItem } from '@azure/storage-blob';
import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers';

let startedContainer: StartedTestContainer;

const createAzuriteContainer = async () => {
	startedContainer = await new GenericContainer('mcr.microsoft.com/azure-storage/azurite')
		.withName('documents-api-it-azurite')
		.withExposedPorts(10000)
		.withCmd(['azurite-blob', '--blobHost', '0.0.0.0']) // 0.0.0.0 is important since the document API system can't reach the Azurite container if its started with the 127.0.0.1 default
		.withWaitStrategy(Wait.forLogMessage(/Azurite Blob service successfully listens on .*/))
		.start();

	process.env.BLOB_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://0.0.0.0:${startedContainer.getMappedPort(
		10000
	)}/devstoreaccount1;`;
	process.env.STORAGE_CONTAINER_NAME = 'documents-api-it-azurite';
};

const isBlobInStorage = async (blobId : string): Promise<boolean> => {

	const blobContainerClient = await _getBlobContainerClient();
	const blobIds: string[] = [];
	
	try {
		for await (const blob of blobContainerClient.listBlobsFlat({ includeMetadata: true })) {
			blobIds.push(blob.metadata?.id!);
		}
	} catch (err) {
		console.log({ err }, 'Error listing blobs');
		throw err;
	}

	return Promise.resolve(blobIds.includes(blobId));
}

const destroyAzuriteContainer = async () => {
	if (startedContainer) {
		await startedContainer.stop();
	}
};

async function _getBlobContainerClient(): Promise<ContainerClient> {
	try {
		const blobContainerClient = BlobServiceClient
			.fromConnectionString(process.env.BLOB_STORAGE_CONNECTION_STRING!)
			.getContainerClient(process.env.STORAGE_CONTAINER_NAME!)
		
		await blobContainerClient.createIfNotExists()

		return Promise.resolve(blobContainerClient);
	} catch (err) {
		console.log({ err }, 'Failed to connect to blob storage');
		throw err;
	}
}

module.exports = {
	createAzuriteContainer,
	isBlobInStorage,
	destroyAzuriteContainer
};
