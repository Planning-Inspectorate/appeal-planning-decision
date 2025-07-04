const { getDataToSave, saveFilesToBlobStorage, saveAction } = require('./multi-file-upload');

const {
	isObjectWithUploadedFiles,
	removeFilesV2,
	getValidFiles,
	generateDocumentSubmissionId
} = require('#lib/multi-file-upload-helpers');
const { createDocument } = require('#lib/documents-api-wrapper');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');
const { getUploadDoumentFunction, getRemoveDocumentFunction } = require('../get-journey-save');

jest.mock('#lib/documents-api-wrapper');
jest.mock('#lib/multi-file-upload-helpers');
jest.mock('@pins/common/src/utils');
jest.mock('../../mappers/document-mapper');
jest.mock('@pins/common/src/dynamic-forms/journey-types', () => ({
	JOURNEY_TYPE: {
		questionnaire: 'questionnaire',
		appealForm: 'appealForm',
		statement: 'statement',
		finalComments: 'finalComments',
		proofEvidence: 'proofEvidence'
	},
	getJourneyTypeById: jest.fn().mockReturnValue({ type: 'appealForm', userType: 'APPELLANT' })
}));
jest.mock('../get-journey-save');

describe('multi-file-upload', () => {
	let req, journeyResponse, questionInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		conjoinedPromises.mockResolvedValue([]);
		req = { body: {}, files: {}, appealsApiClient: {} };
		journeyResponse = {
			referenceId: 'ref-1',
			journeyId: 'appealForm',
			answers: { SubmissionDocumentUpload: [] }
		};
		questionInstance = {
			fieldName: 'SubmissionDocumentUpload',
			documentType: { name: 'test-doc' },
			getRelevantUploadedFiles: jest.fn().mockReturnValue([]),
			checkForSavingErrors: jest.fn(),
			renderAction: jest.fn(),
			handleNextQuestion: jest.fn()
		};
		getUploadDoumentFunction.mockReturnValue(jest.fn());
		getRemoveDocumentFunction.mockReturnValue(jest.fn());
	});

	describe('getDataToSave', () => {
		it('returns empty uploadedFiles if no files and no removals', async () => {
			isObjectWithUploadedFiles.mockReturnValue(false);
			conjoinedPromises.mockResolvedValue([]);
			const result = await getDataToSave.call(questionInstance, req, journeyResponse);
			expect(result.uploadedFiles).toEqual([]);
			expect(result.answers).toEqual({});
		});

		it('removes files and adds errors if removal fails', async () => {
			req.body.removedFiles = '';
			req.body.errorSummary = [];
			req.body.errors = {};
			req.body.removedFiles = JSON.stringify([{ name: 'fail.pdf' }]);
			journeyResponse.answers.SubmissionDocumentUpload = [
				{ originalFileName: 'fail.pdf', storageId: 'id1' }
			];
			questionInstance.getRelevantUploadedFiles = jest
				.fn()
				.mockReturnValue([{ originalFileName: 'fail.pdf', storageId: 'id1' }]);
			removeFilesV2.mockResolvedValue([{ originalFileName: 'fail.pdf', storageId: 'id1' }]);
			isObjectWithUploadedFiles.mockReturnValue(false);
			conjoinedPromises.mockResolvedValue([]);

			const result = await getDataToSave.call(questionInstance, req, journeyResponse);

			expect(result.uploadedFiles).toEqual([]);
			expect(req.body.errors).toBeDefined();
			expect(req.body.errorSummary).toBeDefined();
			expect(req.body.errors.id1).toBeDefined();
			expect(req.body.errorSummary[0].text).toMatch(/Failed to remove file/);
		});

		it('adds uploaded files to journeyResponse', async () => {
			req.files = {
				SubmissionDocumentUpload: [{ name: 'file1.pdf' }]
			};
			getValidFiles.mockReturnValue([{ name: 'file1.pdf' }]);
			isObjectWithUploadedFiles.mockReturnValue(false);
			mapMultiFileDocumentToSavedDocument.mockReturnValue({
				name: 'file1.pdf',
				originalFileName: 'file1.pdf'
			});

			// Simulate blob upload
			conjoinedPromises.mockResolvedValue([
				[{ name: 'file1.pdf' }, { name: 'file1.pdf', originalFileName: 'file1.pdf' }]
			]);

			const result = await getDataToSave.call(questionInstance, req, journeyResponse);

			expect(result.uploadedFiles).toEqual([{ name: 'file1.pdf', originalFileName: 'file1.pdf' }]);
		});

		it('merges uploadedFiles with existing uploadedFiles', async () => {
			journeyResponse.answers.SubmissionDocumentUpload = {
				uploadedFiles: [{ name: 'existing.pdf', originalFileName: 'existing.pdf' }]
			};
			req.files = {
				SubmissionDocumentUpload: [{ name: 'file2.pdf' }]
			};
			getValidFiles.mockReturnValue([{ name: 'file2.pdf' }]);
			isObjectWithUploadedFiles.mockReturnValue(true);
			mapMultiFileDocumentToSavedDocument.mockReturnValue({
				name: 'file2.pdf',
				originalFileName: 'file2.pdf'
			});

			conjoinedPromises.mockResolvedValue([
				[{ name: 'file2.pdf' }, { name: 'file2.pdf', originalFileName: 'file2.pdf' }]
			]);

			const result = await getDataToSave.call(questionInstance, req, journeyResponse);

			expect(result.uploadedFiles).toEqual([
				{ name: 'existing.pdf', originalFileName: 'existing.pdf' },
				{ name: 'file2.pdf', originalFileName: 'file2.pdf' }
			]);
		});
	});

	describe('saveFilesToBlobStorage', () => {
		it('calls createDocument and maps result', async () => {
			const files = [{ name: 'file1.pdf' }];
			const doc = { name: 'doc1', originalFileName: 'file1.pdf' };
			createDocument.mockResolvedValue(doc);
			conjoinedPromises.mockResolvedValue([[files[0], doc]]);
			mapMultiFileDocumentToSavedDocument.mockReturnValue(doc);
			generateDocumentSubmissionId.mockReturnValue('sub-id');

			const result = await saveFilesToBlobStorage.call(questionInstance, files, journeyResponse);
			expect(result).toEqual([doc]);
			expect(conjoinedPromises).toHaveBeenCalled();
			expect(mapMultiFileDocumentToSavedDocument).toHaveBeenCalledWith(
				doc,
				doc.name,
				files[0].name
			);
		});
	});

	describe('saveAction', () => {
		it('calls save and handleNextQuestion', async () => {
			const previouslyUploadedFiles = [];
			const updatedUploadedFiles = [{ name: 'file1.pdf', originalFileName: 'file1.pdf' }];
			const mockSaveFn = jest.fn();
			questionInstance.getRelevantUploadedFiles = jest
				.fn()
				.mockReturnValueOnce(previouslyUploadedFiles)
				.mockReturnValueOnce(updatedUploadedFiles);

			questionInstance.checkForSavingErrors = jest.fn().mockReturnValue(null);
			questionInstance.handleNextQuestion = jest.fn();

			journeyResponse.answers.SubmissionDocumentUpload = {
				uploadedFiles: [{ name: 'existing.pdf', originalFileName: 'existing.pdf' }]
			};

			await saveAction.call(
				questionInstance,
				req,
				{},
				mockSaveFn,
				{ segment: 'seg', response: {} },
				{},
				journeyResponse
			);

			expect(mockSaveFn).toHaveBeenCalled();
			expect(questionInstance.handleNextQuestion).toHaveBeenCalled();
		});

		it('renders action if checkForSavingErrors returns a view model', async () => {
			const previouslyUploadedFiles = [];
			const updatedUploadedFiles = [{ name: 'file1.pdf', originalFileName: 'file1.pdf' }];
			const mockSaveFn = jest.fn();
			questionInstance.getRelevantUploadedFiles = jest
				.fn()
				.mockReturnValueOnce(previouslyUploadedFiles)
				.mockReturnValueOnce(updatedUploadedFiles);

			const viewModel = { error: 'err' };
			questionInstance.checkForSavingErrors = jest.fn().mockReturnValue(viewModel);
			questionInstance.handleNextQuestion = jest.fn();

			journeyResponse.answers.SubmissionDocumentUpload = {
				uploadedFiles: [{ name: 'existing.pdf', originalFileName: 'existing.pdf' }]
			};
			const res = {
				render: jest.fn()
			};

			await saveAction.call(
				questionInstance,
				req,
				res,
				mockSaveFn,
				{ segment: 'seg', response: {} },
				{},
				journeyResponse
			);

			expect(mockSaveFn).toHaveBeenCalled();
			expect(questionInstance.renderAction).toHaveBeenCalledWith(res, viewModel);
			expect(questionInstance.handleNextQuestion).not.toHaveBeenCalled();
		});
	});
});
