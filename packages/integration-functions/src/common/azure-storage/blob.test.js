const { downloadBlob } = require('./blobs');
const { BlobServiceClient } = require('@azure/storage-blob');

jest.mock('@azure/storage-blob', () => {
	return {
		BlobServiceClient: {
			fromConnectionString: jest.fn()
		}
	};
});

const mockDownloadResponse = {
	readableStreamBody: ['fake-stream']
};

const mockBlobClient = {
	download: jest.fn().mockResolvedValue(mockDownloadResponse)
};

const mockContainerClient = {
	getBlobClient: jest.fn().mockReturnValue(mockBlobClient)
};

const mockBlobServiceClient = {
	getContainerClient: jest.fn().mockReturnValue(mockContainerClient)
};

describe('downloadBlob', () => {
	const containerName = 'test-container';
	const blobName = 'test-blob';
	const connectionString = 'fake-connection';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should download a blob', async () => {
		BlobServiceClient.fromConnectionString.mockReturnValue(mockBlobServiceClient);

		const result = await downloadBlob(containerName, blobName, connectionString);

		expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith(connectionString);
		expect(mockBlobServiceClient.getContainerClient).toHaveBeenCalledWith(containerName);
		expect(mockContainerClient.getBlobClient).toHaveBeenCalledWith(blobName);
		expect(mockBlobClient.download).toHaveBeenCalled();
		expect(result).toEqual(mockDownloadResponse.readableStreamBody);
	});

	it('should use function app storage account connection string as a default', async () => {
		process.env.AzureWebJobsStorage = 'mocked-env-connection-string';

		BlobServiceClient.fromConnectionString.mockReturnValue(mockBlobServiceClient);
		await downloadBlob(containerName, blobName);

		expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith(
			process.env.AzureWebJobsStorage
		);
	});

	it('should throw an error if connectionString is missing and no environment variable is set', async () => {
		delete process.env.AzureWebJobsStorage;

		await expect(downloadBlob(containerName, blobName)).rejects.toThrow(
			'Could not retrive default function app connectionString'
		);
	});

	it('should throw an error if blob download fails', async () => {
		const mockBlobClient = {
			download: jest.fn().mockResolvedValue({
				readableStreamBody: null
			})
		};

		const mockContainerClient = {
			getBlobClient: jest.fn().mockReturnValue(mockBlobClient)
		};

		const mockBlobServiceClient = {
			getContainerClient: jest.fn().mockReturnValue(mockContainerClient)
		};

		BlobServiceClient.fromConnectionString.mockReturnValue(mockBlobServiceClient);

		await expect(downloadBlob(containerName, blobName, connectionString)).rejects.toThrow(
			`Failed to download blob: ${containerName}/${blobName}`
		);
	});
});
