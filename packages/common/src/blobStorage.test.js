const { initContainerClient } = require('./blobStorage');
const { BlobServiceClient } = require('@azure/storage-blob');

const mockGetContainerClient = {
	createIfNotExists: () => true
};

jest.mock('@azure/storage-blob', () => ({
	BlobServiceClient: {
		fromConnectionString: () => ({
			getContainerClient: () => mockGetContainerClient
		})
	}
}));

jest.mock('../configuration/config', () => ({
	fileUpload: {
		path: ''
	},
	logger: {
		level: 'info'
	},
	storage: {
		connectionString: '',
		container: ''
	}
}));

describe('initContainerClient', () => {
	it('should return containerClient when the connection is initialised successfully', async () => {
		const result = await initContainerClient();

		expect(result).toStrictEqual(mockGetContainerClient);
	});

	it('should throw an error when an error occurs', async () => {
		BlobServiceClient.fromConnectionString = jest.fn().mockImplementation(() => {
			throw new Error('Internal Server Error');
		});

		try {
			await initContainerClient();
			throw new Error('Expected error not thrown');
		} catch (err) {
			expect(err.message).toEqual('Internal Server Error');
		}

		expect.hasAssertions();
	});
});
