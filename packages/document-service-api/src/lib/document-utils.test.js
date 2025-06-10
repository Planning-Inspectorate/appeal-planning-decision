const testHost = 'https://example.com';
const testContainer = 'boStorageContainer';
jest.mock('#config/config', () => ({
	boStorage: {
		container: testContainer,
		host: testHost
	}
}));
jest.mock('@pins/common/src/lib/getAzureBlobPathFromUri');
const getAzureBlobPathFromUri = require('@pins/common/src/lib/getAzureBlobPathFromUri');

const { mapDocumentToBlobInfo } = require('./document-utils');

describe('Document Access Utils', () => {
	describe('mapDocumentToBlobInfo', () => {
		const testFileName = 'test-file.pdf';
		const testFileURI = `${testHost}/${testContainer}/${testFileName}`;
		beforeEach(() => {
			jest.clearAllMocks();
			getAzureBlobPathFromUri.mockReturnValue(testFileURI);
		});

		it('should map document to blob info', () => {
			const document = {
				filename: testFileName,
				documentURI: testFileURI,
				documentType: 'test-type'
			};

			const result = mapDocumentToBlobInfo(document);
			expect(result).toEqual({
				fullName: `${document.documentType}/${document.filename}`,
				blobStorageContainer: testContainer,
				blobStoragePath: testFileURI,
				documentURI: document.documentURI
			});
		});

		it('should return null if documentType is missing', () => {
			const document = {
				filename: 'test-file.pdf',
				documentURI: 'https://example.com/test-file.pdf',
				documentType: ''
			};

			const result = mapDocumentToBlobInfo(document);
			expect(result).toBeNull();
		});
	});
});
