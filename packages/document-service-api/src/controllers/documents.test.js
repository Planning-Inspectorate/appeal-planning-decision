const { getDocumentsForApplication, getDocumentById, deleteDocument } = require('./documents');
const BlobStorage = require('../lib/blobStorage');
const { mockReq, mockRes } = require('../../test/utils/mocks');

const containerClient = () => 'mock-container-client';
const applicationId = 'be046963-6cdd-4958-bd58-11be56304329';
const documentId = '72c188c7-d034-48a9-b712-c94a1c571f9d';
const fileOne = {
	metadata: {
		name: 'document-one.pdf',
		location: `${applicationId}/${documentId}/document-one.pdf`,
		mime_type: 'application/pdf',
		size: 1000
	}
};
const fileTwo = {
	metadata: {
		name: 'document-two.pdf',
		location: `${applicationId}/${documentId}/document-two.pdf`,
		mime_type: 'application/pdf',
		size: 2000
	}
};
const multipleFilesReturnValue = [fileOne, fileTwo];
const singleFileReturnValue = fileOne;

jest.mock('../lib/blobStorage', () => ({
	getMetadataForAllFiles: jest.fn(),
	getMetadataForSingleFile: jest.fn(),
	downloadFile: jest.fn(),
	uploadFile: jest.fn(),
	deleteFile: jest.fn()
}));

jest.mock('@pins/common', () => ({
	...jest.requireActual('@pins/common'),
	initContainerClient: containerClient
}));

jest.mock('../lib/deleteLocalFile');

jest.mock('../configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

describe('controllers/documents', () => {
	const res = mockRes();

	let req;

	beforeEach(() => {
		req = {
			...mockReq,
			query: {
				base64: 'false'
			}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getDocumentsForApplication', () => {
		it('should return documents when given a valid application id', async () => {
			req.params.applicationId = applicationId;

			BlobStorage.getMetadataForAllFiles.mockReturnValue(multipleFilesReturnValue);

			await getDocumentsForApplication(req, res);

			expect(BlobStorage.getMetadataForAllFiles).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForAllFiles).toHaveBeenCalledWith(
				containerClient(),
				applicationId
			);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith(multipleFilesReturnValue);
		});

		it('should return an error when given an invalid application id', async () => {
			req.params.applicationId = undefined;

			BlobStorage.getMetadataForAllFiles.mockReturnValue([]);

			await getDocumentsForApplication(req, res);

			expect(BlobStorage.getMetadataForAllFiles).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForAllFiles).toHaveBeenCalledWith(containerClient(), undefined);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Invalid application id'
			});
		});

		it('should return an error when an error is thrown getting all documents', async () => {
			BlobStorage.getMetadataForAllFiles.mockImplementation(() => {
				throw new Error('Internal Server Error');
			});

			await getDocumentsForApplication(req, res);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Internal Server Error'
			});
		});
	});

	describe('getDocumentById', () => {
		it('should return a document when given a valid application and document id', async () => {
			req.params.applicationId = applicationId;
			req.params.documentId = documentId;

			BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);

			await getDocumentById(req, res);

			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledWith(
				containerClient(),
				applicationId,
				documentId
			);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith(singleFileReturnValue);
		});

		it('should return an error when given an invalid application id', async () => {
			req.params.applicationId = undefined;
			req.params.documentId = documentId;

			BlobStorage.getMetadataForSingleFile.mockReturnValue(null);

			await getDocumentById(req, res);

			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledWith(
				containerClient(),
				undefined,
				documentId
			);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Invalid application or document id'
			});
		});

		it('should return an error when given an invalid document id', async () => {
			req.params.applicationId = applicationId;
			req.params.documentId = undefined;

			BlobStorage.getMetadataForSingleFile.mockReturnValue(null);

			await getDocumentById(req, res);

			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledWith(
				containerClient(),
				applicationId,
				undefined
			);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Invalid application or document id'
			});
		});

		it('should return an error when an error is thrown getting the document', async () => {
			BlobStorage.getMetadataForSingleFile.mockImplementation(() => {
				throw new Error('Internal Server Error');
			});

			await getDocumentById(req, res);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Internal Server Error'
			});
		});
	});

	describe('deleteDocument', () => {
		it('should return the correct status when a document is deleted successfully', async () => {
			req.params.applicationId = applicationId;
			req.params.documentId = documentId;

			BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);
			BlobStorage.deleteFile.mockReturnValue(true);

			await deleteDocument(req, res);

			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledWith(
				containerClient(),
				applicationId,
				documentId
			);
			expect(BlobStorage.deleteFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.deleteFile).toHaveBeenCalledWith(
				containerClient(),
				singleFileReturnValue.metadata.location
			);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith();
		});

		it('should return an error when no metadata is returned for the given document', async () => {
			req.params.applicationId = undefined;
			req.params.documentId = documentId;

			BlobStorage.getMetadataForSingleFile.mockReturnValue(null);

			await deleteDocument(req, res);

			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledWith(
				containerClient(),
				undefined,
				documentId
			);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Invalid application or document id'
			});
		});

		it('should return an error when the document is not deleted', async () => {
			req.params.applicationId = applicationId;
			req.params.documentId = documentId;

			BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);
			BlobStorage.deleteFile.mockReturnValue(false);

			await deleteDocument(req, res);

			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.getMetadataForSingleFile).toHaveBeenCalledWith(
				containerClient(),
				applicationId,
				documentId
			);
			expect(BlobStorage.deleteFile).toHaveBeenCalledTimes(1);
			expect(BlobStorage.deleteFile).toHaveBeenCalledWith(
				containerClient(),
				singleFileReturnValue.metadata.location
			);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Failed to delete document'
			});
		});

		it('should return an error when an error is thrown deleting the document', async () => {
			BlobStorage.getMetadataForSingleFile.mockImplementation(() => {
				throw new Error('Internal Server Error');
			});

			await deleteDocument(req, res);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Internal Server Error'
			});
		});
	});
});
