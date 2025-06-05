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

const {
	checkDocumentAccessByRepresentationOwner,
	mapDocumentToBlobInfo
} = require('./document-access-utils');
const { APPEAL_REPRESENTATION_STATUS } = require('pins-data-model');

describe('Document Access Utils', () => {
	describe('checkDocumentAccessByRepresentationOwner', () => {
		it('should return true if representation is not in map', () => {
			const doc = { id: 'doc1' };

			expect(checkDocumentAccessByRepresentationOwner(doc, new Map())).toBe(true);
		});

		it('should return true if user owns representation and non published status', () => {
			const doc = { id: 'doc1' };
			const map = new Map();
			map.set('doc1', {
				userOwnsRepresentation: true,
				representationStatus: APPEAL_REPRESENTATION_STATUS.DRAFT
			});

			expect(checkDocumentAccessByRepresentationOwner(doc, map)).toBe(true);
		});

		it('should return true if representation published for non owner', () => {
			const doc = { id: 'doc1' };
			const map = new Map();
			map.set('doc1', {
				userOwnsRepresentation: false,
				representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED
			});

			expect(checkDocumentAccessByRepresentationOwner(doc, map)).toBe(true);
		});

		it('should return false if representation is not visible for user', () => {
			const doc = { id: 'doc2' };
			const map = new Map();
			map.set('doc2', {
				userOwnsRepresentation: false,
				representationStatus: APPEAL_REPRESENTATION_STATUS.DRAFT
			});

			expect(checkDocumentAccessByRepresentationOwner(doc, map)).toBe(false);
		});
	});

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
