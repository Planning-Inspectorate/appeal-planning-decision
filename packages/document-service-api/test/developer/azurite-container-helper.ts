import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';

let startedContainer: StartedTestContainer;

const createAzuriteContainer = async () => {
	startedContainer = await new GenericContainer('mcr.microsoft.com/azure-storage/azurite')
		.withName('documents-api-it-azurite')
		.withExposedPorts(10000)
		.withCmd(['azurite-blob', '--blobHost', '0.0.0.0'])
		.withWaitStrategy(Wait.forLogMessage(/Azurite Blob service successfully listens on .*/))
		.start();

	process.env.BLOB_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://0.0.0.0:${startedContainer.getMappedPort(
		10000
	)}/devstoreaccount1;`;
	process.env.STORAGE_CONTAINER_NAME = 'documents-api-it-azurite';

	//TODO: put these in a global set-up Jest config file
	process.env.FILE_MAX_SIZE_IN_BYTES = '9999999';
	process.env.FILE_UPLOAD_PATH = __dirname;
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
