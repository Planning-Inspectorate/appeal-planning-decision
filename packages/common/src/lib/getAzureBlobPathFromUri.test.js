const getAzureBlobPathFromUri = require('./getAzureBlobPathFromUri');

describe('getAzureBlobPathFromUri', () => {
	const testBlobUri = 'https://host/container-name/blob-path/blobName.txt';

	it('returns trimmed blob path', () => {
		expect(getAzureBlobPathFromUri(testBlobUri, 'https://host', 'container-name')).toEqual(
			'blob-path/blobName.txt'
		);
	});

	it('returns trimmed blob path with slash in host', () => {
		expect(getAzureBlobPathFromUri(testBlobUri, 'https://host/', 'container-name')).toEqual(
			'blob-path/blobName.txt'
		);
	});

	it('returns trimmed blob path with no container in url', () => {
		expect(
			getAzureBlobPathFromUri(
				'https://host/blob-path/blobName.txt',
				'https://host',
				'container-name'
			)
		).toEqual('blob-path/blobName.txt');
	});
});
