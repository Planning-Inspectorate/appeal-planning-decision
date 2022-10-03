/**
 * This file allows integration tests to spin up an Azurite container to provide document (BLOB) storage
 * functionality in as much of a production-like sense as possible!
 *
 * Code here is informed by the official Azurite docs which can be found here:
 * https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=docker-hub#command-line-options
 */
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

const destroyAzuriteContainer = async () => {
	if (startedContainer) {
		await startedContainer.stop();
	}
};

module.exports = {
	createAzuriteContainer,
	destroyAzuriteContainer
};
