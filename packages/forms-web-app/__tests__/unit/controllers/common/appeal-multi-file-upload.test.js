const {
	getAppealMultiFileUpload,
	postAppealMultiFileUpload
} = require('../../../../src/controllers/common/appeal-multi-file-upload');

const { removeFiles, getValidFiles } = require('../../../../src/lib/multi-file-upload-helpers');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../src/lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../../src/mappers/document-mapper');
const { postSaveAndReturn } = require('../../../../src/controllers/save');

const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/multi-file-upload-helpers');
jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../src/mappers/document-mapper');
jest.mock('../../../../src/controllers/save');

const mockFile = {
	name: 'test.png'
};

const mockFile2 = {
	name: 'another-file.jpg'
};

const mockFile3 = {
	name: 'yet-another-file.jpg'
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

const mockUploadedFile3 = {
	id: 'id-3',
	name: 'yet-another-file.jpg',
	fileName: 'yet-another-file.jpg',
	originalFileName: 'yet-another-file.jpg',
	message: {
		text: 'yet-another-file.jpg'
	},
	location: 'e/f',
	size: 450
};

describe('controllers/common/appeal-multi-file-upload', () => {
	let req;
	let res;
	let fullAppeal;

	beforeEach(() => {
		fullAppeal = require('@pins/business-rules/test/data/full-appeal');
		req = mockReq(fullAppeal);
		req = {
			...req,
			body: {
				files: {}
			},
			taskName: '',
			sectionName: ''
		};
		res = mockRes();
		jest.resetAllMocks();
		jest.resetModules();
	});

	describe('getAppealMultiFileUpload', () => {
		it('should render page correctly', async () => {
			req.sectionName = 'appealDocumentsSection';
			req.taskName = 'draftPlanningObligations';

			const returnedFunction = getAppealMultiFileUpload('fakeView');
			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith('fakeView', {
				uploadedFiles: fullAppeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles
			});
		});
	});

	describe('postAppealMultiFileUpload', () => {
		it('should upload files, set session, and redirect to correct page if valid files added', async () => {
			req.body.files['file-upload'] = [mockFile, mockFile2];
			req.sectionName = 'appealDocumentsSection';
			req.taskName = 'draftPlanningObligations';
			req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles = [];

			getValidFiles.mockReturnValueOnce([mockFile, mockFile2]);
			mapMultiFileDocumentToSavedDocument
				.mockReturnValueOnce(mockUploadedFile)
				.mockReturnValueOnce(mockUploadedFile2);
			createDocument.mockReturnValueOnce(mockUploadedFile).mockReturnValueOnce(mockUploadedFile2);

			createOrUpdateAppeal.mockReturnValue(req.session.appeal);

			const returnedFunction = postAppealMultiFileUpload(
				'fakeCurrentView',
				'fakeNextView',
				'draftPlanningObligations',
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);
			await returnedFunction(req, res);

			expect(createDocument).toHaveBeenCalledWith(
				fullAppeal,
				mockFile,
				mockFile.name,
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);

			expect(createDocument).toHaveBeenCalledWith(
				fullAppeal,
				mockFile2,
				mockFile2.name,
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);

			expect(res.redirect).toHaveBeenCalledWith('/fakeNextView');

			expect(
				req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles
			).toEqual([mockUploadedFile, mockUploadedFile2]);
			expect(
				req.session.appeal.sectionStates.appealDocumentsSection.draftPlanningObligations
			).toEqual('COMPLETED');
			expect(postSaveAndReturn).not.toHaveBeenCalled();
		});

		it('should remove files correctly', async () => {
			//upload files on first post request
			req.body.files['file-upload'] = [mockFile, mockFile2, mockFile3];
			req.sectionName = 'appealDocumentsSection';
			req.taskName = 'draftPlanningObligations';
			req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles = [];

			getValidFiles.mockReturnValueOnce([mockFile, mockFile2, mockFile3]);
			mapMultiFileDocumentToSavedDocument
				.mockReturnValueOnce(mockUploadedFile)
				.mockReturnValueOnce(mockUploadedFile2)
				.mockReturnValueOnce(mockUploadedFile3);
			createDocument
				.mockReturnValueOnce(mockUploadedFile)
				.mockReturnValueOnce(mockUploadedFile2)
				.mockReturnValueOnce(mockUploadedFile3);
			createOrUpdateAppeal.mockReturnValue(req.session.appeal);

			const returnedFunction = postAppealMultiFileUpload(
				'fakeCurrentView',
				'fakeNextView',
				'draftPlanningObligations',
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);
			await returnedFunction(req, res);

			//remove two files on second post request
			req.body.files['file-upload'] = null;
			req.body.removedFiles = `[{"name":"${mockUploadedFile.name}"},{"name":"${mockUploadedFile3.name}"}]`;
			removeFiles.mockReturnValueOnce([mockUploadedFile2]);

			await returnedFunction(req, res);

			expect(removeFiles).toHaveBeenCalledWith(
				[mockUploadedFile, mockUploadedFile2, mockUploadedFile3],
				[{ name: mockUploadedFile.name }, { name: mockUploadedFile3.name }]
			);

			expect(res.redirect).toHaveBeenCalledWith('/fakeNextView');
			expect(postSaveAndReturn).not.toHaveBeenCalled();

			expect(
				req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles
			).toEqual([mockUploadedFile2]);
			expect(
				req.session.appeal.sectionStates.appealDocumentsSection.draftPlanningObligations
			).toEqual('COMPLETED');
		});

		it('can handle removal and addition of files in a single request', async () => {
			//upload files on first post request
			req.body.files['file-upload'] = [mockFile, mockFile2];
			req.sectionName = 'planningApplicationDocumentsSection';
			req.taskName = 'plansDrawingsSupportingDocuments';
			req.session.appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles =
				[];

			getValidFiles.mockReturnValueOnce([mockFile, mockFile2]);
			mapMultiFileDocumentToSavedDocument
				.mockReturnValueOnce(mockUploadedFile)
				.mockReturnValueOnce(mockUploadedFile2);
			createOrUpdateAppeal.mockReturnValue(req.session.appeal);

			const returnedFunction = postAppealMultiFileUpload(
				'fakeCurrentView',
				'fakeNextView',
				'plansDrawingsSupportingDocuments',
				'plansDrawingsSupportingDocuments'
			);
			await returnedFunction(req, res);

			//remove a file and upload a file on second post request
			req.body.files['file-upload'] = [mockFile3];
			req.body.removedFiles = `[{"name":"${mockUploadedFile2.name}"}]`;
			removeFiles.mockReturnValueOnce([mockUploadedFile]);

			getValidFiles.mockReturnValueOnce([mockFile3]);
			mapMultiFileDocumentToSavedDocument.mockReturnValueOnce(mockUploadedFile3);

			await returnedFunction(req, res);

			expect(
				req.session.appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
					.uploadedFiles
			).toEqual([mockUploadedFile, mockUploadedFile3]);

			expect(
				req.session.appeal.sectionStates.planningApplicationDocumentsSection
					.plansDrawingsSupportingDocuments
			).toEqual('COMPLETED');
		});

		it('should re-render template with errors if errors thrown', async () => {
			req.sectionName = 'appealDocumentsSection';
			req.taskName = 'draftPlanningObligations';
			req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles = [];

			const errors = {
				'files.file-upload[0]': {
					value: { name: 'not-valid-mimetype.gif' },
					msg: 'not-valid-mimetype.gif must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX',
					param: 'files.file-upload[0]',
					location: 'body'
				},
				'files.file-upload[1]': {
					value: { name: 'also-not-valid-mimetype.webp' },
					msg: 'also-not-valid-mimetype.gif must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX',
					param: 'files.file-upload[1]',
					location: 'body'
				}
			};
			const errorSummary = [
				{
					text: 'not-valid-mimetype.gif must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX',
					href: '#'
				},
				{
					text: 'also-not-valid-mimetype.webp must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX',
					href: '#'
				}
			];

			req.body.errors = errors;
			req.body.errorSummary = errorSummary;

			createOrUpdateAppeal.mockReturnValue(req.session.appeal);

			const returnedFunction = postAppealMultiFileUpload(
				'fakeCurrentView',
				'fakeNextView',
				'draftPlanningObligations',
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);
			await returnedFunction(req, res);

			expect(createDocument).not.toHaveBeenCalled();
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith('fakeCurrentView', {
				uploadedFiles:
					req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles,
				errors: errors,
				errorSummary: errorSummary
			});

			expect(
				req.session.appeal.sectionStates.appealDocumentsSection.draftPlanningObligations
			).toEqual('NOT STARTED');
		});

		it('should handle a request containing valid and invalid files', async () => {
			const errors = {
				'files.file-upload[1]': {
					value: { name: 'error-throwing-file.gif' },
					msg: 'error-throwing-file.gif must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX',
					param: 'files.file-upload[1]',
					location: 'body'
				}
			};

			const errorSummary = [
				{
					text: 'error-throwing-file.gif must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX',
					href: '#'
				}
			];

			const errorFile = { name: 'error-throwing-file.gif' };

			req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles = [];
			req.sectionName = 'planningApplicationDocumentsSection';
			req.taskName = 'plansDrawingsSupportingDocuments';
			req.body.files['file-upload'] = [mockFile, errorFile];
			req.body.errors = errors;
			req.body.errorSummary = errorSummary;

			getValidFiles.mockReturnValueOnce([mockFile]);
			mapMultiFileDocumentToSavedDocument.mockReturnValueOnce([mockUploadedFile]);
			createDocument.mockReturnValueOnce([mockUploadedFile]);
			createOrUpdateAppeal.mockReturnValue(req.session.appeal);

			const returnedFunction = postAppealMultiFileUpload(
				'fakeCurrentView',
				'fakeNextView',
				'plansDrawingsSupportingDocuments',
				'plansDrawingsSupportingDocuments'
			);
			await returnedFunction(req, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith('fakeCurrentView', {
				uploadedFiles:
					req.session.appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
						.uploadedFiles,
				errors: errors,
				errorSummary: errorSummary
			});

			expect(createDocument).toHaveBeenCalledWith(
				fullAppeal,
				mockFile,
				mockFile.name,
				'plansDrawingsSupportingDocuments',
				''
			);

			expect(createDocument).not.toHaveBeenCalledWith(
				fullAppeal,
				errorFile,
				errorFile.name,
				'plansDrawingsSupportingDocuments',
				''
			);

			expect(
				req.session.appeal.sectionStates.planningApplicationDocumentsSection
					.plansDrawingsSupportingDocuments
			).toEqual('NOT STARTED');
		});

		it('should handle save and return requests correctly', async () => {
			req.body = {
				...req.body,
				'save-and-return': ''
			};
			req.body.files['file-upload'] = [mockFile, mockFile2];
			req.sectionName = 'appealDocumentsSection';
			req.taskName = 'draftPlanningObligations';
			req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles = [];

			getValidFiles.mockReturnValueOnce([mockFile, mockFile2]);
			mapMultiFileDocumentToSavedDocument
				.mockReturnValueOnce(mockUploadedFile)
				.mockReturnValueOnce(mockUploadedFile2);
			createDocument.mockReturnValueOnce(mockUploadedFile).mockReturnValueOnce(mockUploadedFile2);
			createOrUpdateAppeal.mockReturnValue(req.session.appeal);

			const returnedFunction = postAppealMultiFileUpload(
				'fakeCurrentView',
				'fakeNextView',
				'draftPlanningObligations',
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);
			await returnedFunction(req, res);

			expect(createDocument).toHaveBeenCalledWith(
				fullAppeal,
				mockFile,
				mockFile.name,
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);

			expect(createDocument).toHaveBeenCalledWith(
				fullAppeal,
				mockFile2,
				mockFile2.name,
				'draftPlanningObligations',
				'DRAFT PLANNING OBLIGATION'
			);

			expect(res.redirect).not.toHaveBeenCalled;
			expect(postSaveAndReturn).toHaveBeenCalledWith(req, res);

			expect(
				req.session.appeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles
			).toEqual([mockUploadedFile, mockUploadedFile2]);
			expect(
				req.session.appeal.sectionStates.appealDocumentsSection.draftPlanningObligations
			).toEqual('IN PROGRESS');
		});
	});
});
