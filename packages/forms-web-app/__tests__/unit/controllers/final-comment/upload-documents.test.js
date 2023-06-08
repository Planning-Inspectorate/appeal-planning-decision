const {
	getUploadDocuments,
	postUploadDocuments
} = require('../../../../src/controllers/final-comment/upload-documents');
const finalComment = require('../../../mockData/final-comment');

const { VIEW } = require('../../../../src/lib/views');
const { getValidFiles, removeFiles } = require('../../../../src/lib/multi-file-upload-helpers');
const { createDocument } = require('../../../../src/lib/documents-api-wrapper');

const { mockReq, mockRes } = require('../../mocks');
const { mapMultiFileDocumentToSavedDocument } = require('../../../../src/mappers/document-mapper');

jest.mock('../../../../src/lib/multi-file-upload-helpers');
jest.mock('../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../src/mappers/document-mapper');
jest.mock('@pins/common', () => ({ documentTypes: { uploadDocuments: { name: 'testType' } } }));

const mockFile = {
	name: 'test.png'
};

const mockFile2 = {
	name: 'another-file.jpg'
};

const mockUploadedFile = {
	id: 'id-1',
	name: 'test.png',
	fileName: 'test.png',
	originalFileName: 'test.png',
	message: {
		text: 'test.png'
	},
	location: 'a/b',
	size: 200
};

const mockUploadedFile2 = {
	id: 'id-2',
	name: 'another-file.jpg',
	fileName: 'another-file.jpg',
	originalFileName: 'another-file.jpg',
	message: {
		text: 'another-file.jpg'
	},
	location: 'c/d',
	size: 400
};

describe('controllers/final-comment/upload-documents', () => {
	let req;
	let res;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for final comments
		req = {
			...mockReq(null),
			session: { finalComment },
			body: {
				files: {}
			}
		};
		res = mockRes();

		req.session.finalComment.supportingDocuments.uploadedFiles = [];
		jest.resetAllMocks();
	});

	describe('getUploadDocuments', () => {
		it('should render the template correctly', async () => {
			await getUploadDocuments(req, res);
			expect(res.render).toHaveBeenCalledWith(VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS, {
				uploadedFiles: req.session.finalComment.supportingDocuments.uploadedFiles
			});
		});
	});

	describe('postUploadDocuments', () => {
		it('should upload files, set session correctly, and redirect to correct page if valid files added', async () => {
			req.body.files['upload-documents'] = [mockFile, mockFile2];

			getValidFiles.mockReturnValueOnce([mockFile, mockFile2]);
			mapMultiFileDocumentToSavedDocument
				.mockReturnValueOnce(mockUploadedFile)
				.mockReturnValueOnce(mockUploadedFile2);

			await postUploadDocuments(req, res);

			expect(createDocument).toHaveBeenCalledWith(
				req.session.finalComment,
				mockFile,
				mockFile.name,
				'testType'
			);
			expect(createDocument).toHaveBeenCalledWith(
				req.session.finalComment,
				mockFile2,
				mockFile2.name,
				'testType'
			);
			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS}`);

			expect(req.session.finalComment.supportingDocuments.uploadedFiles).toEqual([
				mockUploadedFile,
				mockUploadedFile2
			]);
		});

		it('should remove a file correctly', async () => {
			// upload files on first post request
			req.body.files['upload-documents'] = [mockFile, mockFile2];

			getValidFiles.mockReturnValueOnce([mockFile, mockFile2]);
			mapMultiFileDocumentToSavedDocument
				.mockReturnValueOnce(mockUploadedFile)
				.mockReturnValueOnce(mockUploadedFile2);

			await postUploadDocuments(req, res);

			// remove one of the files on second post request
			req.body.files['upload-documents'] = null;
			req.body.removedFiles = `[{"name":"${mockUploadedFile.name}"}]`;
			removeFiles.mockReturnValueOnce([mockUploadedFile2]);

			await postUploadDocuments(req, res);

			expect(removeFiles).toHaveBeenCalledWith(
				[mockUploadedFile, mockUploadedFile2],
				[{ name: mockUploadedFile.name }]
			);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS}`);

			expect(req.session.finalComment.supportingDocuments.uploadedFiles).toEqual([
				mockUploadedFile2
			]);
		});

		it('should re-render template with errors if errors thrown', async () => {
			const errors = {
				'files.upload-documents[0]': {
					value: { name: 'not-valid-mimetype.gif' },
					msg: 'not-valid-mimetype.gif must be a DOC, DOCX, PDF, TIF, JPG or PNG',
					param: 'files.upload-documents[0]',
					location: 'body'
				},
				'files.upload-documents[1]': {
					value: { name: 'also-not-valid-mimetype.webp' },
					msg: 'also-not-valid-mimetype.gif must be a DOC, DOCX, PDF, TIF, JPG or PNG',
					param: 'files.upload-documents[1]',
					location: 'body'
				}
			};
			const errorSummary = [
				{
					text: 'not-valid-mimetype.gif must be a DOC, DOCX, PDF, TIF, JPG or PNG',
					href: '#files.upload-documents[0]'
				},
				{
					text: 'also-not-valid-mimetype.webp must be a DOC, DOCX, PDF, TIF, JPG or PNG',
					href: '#files.upload-documents[1]'
				}
			];

			req.body.errors = errors;
			req.body.errorSummary = errorSummary;

			await postUploadDocuments(req, res);

			errorSummary[0].href = '#upload-documents-error';
			errorSummary[1].href = '#upload-documents-error';

			expect(createDocument).not.toHaveBeenCalled();
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS, {
				finalComment: req.session.finalComment,
				errors: errors,
				errorSummary: errorSummary
			});
		});

		it('should handle a request containing valid and invalid files', async () => {
			const errors = {
				'files.upload-documents[1]': {
					value: { name: 'error-throwing-file.gif' },
					msg: 'error-throwing-file.gif must be a DOC, DOCX, PDF, TIF, JPG or PNG',
					param: 'files.upload-documents[1]',
					location: 'body'
				}
			};

			const errorSummary = [
				{
					text: 'error-throwing-file.gif must be a DOC, DOCX, PDF, TIF, JPG or PNG',
					href: '#files-upload-documents[1]'
				}
			];

			const errorFile = { name: 'error-throwing-file.gif' };

			req.body.files['upload-documents'] = [mockFile, errorFile];
			req.body.errors = errors;
			req.body.errorSummary = errorSummary;

			getValidFiles.mockReturnValueOnce([mockFile]);
			mapMultiFileDocumentToSavedDocument.mockReturnValueOnce(mockUploadedFile);

			await postUploadDocuments(req, res);

			errorSummary[0].href = '#upload-documents-error';

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS, {
				finalComment: req.session.finalComment,
				errors: errors,
				errorSummary: errorSummary
			});

			expect(createDocument).toHaveBeenCalledWith(
				req.session.finalComment,
				mockFile,
				mockFile.name,
				'testType'
			);

			expect(createDocument).not.toHaveBeenCalledWith(
				req.session.finalComment,
				errorFile,
				errorFile.name,
				'testType'
			);

			expect(req.session.finalComment.supportingDocuments.uploadedFiles).toEqual([
				mockUploadedFile
			]);
		});
	});
});
