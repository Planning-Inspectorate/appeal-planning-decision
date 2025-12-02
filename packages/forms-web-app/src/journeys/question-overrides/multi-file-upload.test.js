jest.mock('#lib/documents-api-wrapper');
jest.mock('../get-journey-save');
jest.mock('../../lib/multi-file-upload-helpers');

const { createDocument } = require('#lib/documents-api-wrapper');
const { createQuestions } = require('@pins/dynamic-forms/src/create-questions');
const MultiFileUploadQuestion = require('@pins/dynamic-forms/src/dynamic-components/multi-file-upload/question');
const multiFileUploadOverrides = require('./multi-file-upload');
const { getUploadDoumentFunction, getRemoveDocumentFunction } = require('../get-journey-save');
const multiFileUploadHelpers = require('../../lib/multi-file-upload-helpers');

/**
 * @param {string} name
 */
function makeTestFile(name) {
	return {
		name
	};
}

const res = {};

describe('multi-file-upload', () => {
	let req, journeyResponse, uploadDocument;
	/**
	 * @type {import('@pins/dynamic-forms/src/dynamic-components/multi-file-upload/question')}
	 */
	let questionInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		createDocument.mockImplementation(() =>
			Promise.resolve({
				id: 'doc1',
				name: 'file1.pdf',
				originalFileName: 'file1.pdf',
				location: '/docs/file1.pdf',
				size: '123'
			})
		);

		req = { body: {}, files: { TestUpload: [] } };
		journeyResponse = {
			referenceId: 'ref-1',
			journeyId: 'has-appeal-form',
			answers: {}
		};
		const questionProps = {
			test: {
				type: 'multi-file-upload',
				title: 'Test',
				question: 'test',
				fieldName: 'TestUpload',
				url: 'test',
				validators: [],
				documentType: { name: 'test' }
			}
		};
		const questionClasses = {
			'multi-file-upload': MultiFileUploadQuestion
		};
		const overrides = {
			'multi-file-upload': multiFileUploadOverrides
		};
		const questions = createQuestions({}, questionProps, questionClasses, overrides);
		questionInstance = questions.test;
		questionInstance.handleNextQuestion = jest.fn();
		questionInstance.renderAction = jest.fn();

		multiFileUploadHelpers.getValidFiles.mockImplementation((errors, files) => files);

		uploadDocument = jest.fn();
		getUploadDoumentFunction.mockReturnValue(uploadDocument);

		multiFileUploadHelpers.removeFilesV2.mockResolvedValue([]);
		getRemoveDocumentFunction.mockReturnValue(jest.fn());
	});

	describe('getDataToSave', () => {
		it('returns empty uploadedFiles if no files and no removals', async () => {
			const result = await questionInstance.getDataToSave(req, journeyResponse);

			expect(result.uploadedFiles).toEqual([]);
			expect(result.answers).toEqual({});
		});

		it('adds uploaded files to journeyResponse', async () => {
			req.files = {
				TestUpload: [makeTestFile('file1.pdf')]
			};

			const result = await questionInstance.getDataToSave(req, journeyResponse, []);

			expect(result.uploadedFiles[0].name).toBe('file1.pdf');
			expect(createDocument).toHaveBeenCalled();
		});

		it('returns new files but does not remove existing files', async () => {
			journeyResponse.answers.SubmissionDocumentUpload = [
				{ name: 'existing.pdf', originalFileName: 'existing.pdf', type: 'test' }
			];
			req.files = {
				TestUpload: [makeTestFile('file2.pdf')]
			};
			createDocument.mockImplementation(() =>
				Promise.resolve({
					id: 'doc2',
					name: 'file2.pdf',
					originalFileName: 'file2.pdf',
					location: '/docs/file2.pdf',
					size: '456',
					type: 'test'
				})
			);
			const result = await questionInstance.getDataToSave(req, journeyResponse, []);
			expect(result.uploadedFiles.length).toBe(1);
			expect(result.uploadedFiles[0].name).toBe('file2.pdf');
			expect(createDocument).toHaveBeenCalledTimes(1);
			expect(multiFileUploadHelpers.removeFilesV2).toHaveBeenCalledTimes(0);
		});

		it('removes files', async () => {
			req.body.removedFiles = JSON.stringify([{ name: 'fail.pdf' }]);
			journeyResponse.answers.SubmissionDocumentUpload = [
				{ originalFileName: 'fail.pdf', storageId: 'id1', type: 'test' }
			];
			const result = await questionInstance.getDataToSave(req, journeyResponse);
			expect(result.uploadedFiles).toEqual([]);
			expect(multiFileUploadHelpers.removeFilesV2).toHaveBeenCalledTimes(1);
		});

		it('replaces files', async () => {
			journeyResponse.answers.SubmissionDocumentUpload = [
				{ name: 'existing.pdf', originalFileName: 'existing.pdf', type: 'test' }
			];
			req.files = {
				TestUpload: [makeTestFile('existing.pdf')]
			};
			createDocument.mockImplementation(() =>
				Promise.resolve({
					id: 'existing',
					name: 'existing.pdf',
					originalFileName: 'existing.pdf',
					location: '/docs/existing.pdf',
					size: '456',
					type: 'test'
				})
			);
			const result = await questionInstance.getDataToSave(req, journeyResponse, [
				{ id: '', type: 'test', originalFileName: 'existing.pdf', storageId: '' }
			]);
			expect(result.uploadedFiles.length).toBe(1);
			expect(result.uploadedFiles[0].name).toBe('existing.pdf');
			expect(createDocument).toHaveBeenCalledTimes(1);
			expect(multiFileUploadHelpers.removeFilesV2).toHaveBeenCalledTimes(1);
		});
	});

	describe('saveFilesToBlobStorage', () => {
		it('calls createDocument and maps result', async () => {
			const files = [makeTestFile('file1.pdf')];

			const result = await questionInstance.saveFilesToBlobStorage(files, journeyResponse);

			expect(result[0].originalFileName).toBe('file1.pdf');
			expect(createDocument).toHaveBeenCalled();
		});
		it('returns empty array if no files', async () => {
			const files = [];

			const result = await questionInstance.saveFilesToBlobStorage(files, journeyResponse);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(0);
			expect(createDocument).not.toHaveBeenCalled();
		});
	});

	describe('saveAction', () => {
		it('works with no files', async () => {
			const mockSaveFn = jest.fn();

			await questionInstance.saveAction(
				req,
				res,
				mockSaveFn,
				{ segment: 'seg', response: {} },
				{},
				journeyResponse
			);

			expect(uploadDocument).toHaveBeenCalledTimes(0);
			expect(multiFileUploadHelpers.removeFilesV2).toHaveBeenCalledTimes(0);
			expect(mockSaveFn).toHaveBeenCalledTimes(1);
			expect(questionInstance.handleNextQuestion).toHaveBeenCalledTimes(1);
		});

		it('works with a single file', async () => {
			const mockSaveFn = jest.fn();
			req.files = { TestUpload: [makeTestFile('file1.pdf')] };

			await questionInstance.saveAction(
				req,
				res,
				mockSaveFn,
				{ segment: 'seg', response: {} },
				{},
				journeyResponse
			);

			expect(uploadDocument).toHaveBeenCalledTimes(1);
			expect(multiFileUploadHelpers.removeFilesV2).toHaveBeenCalledTimes(0);
			expect(mockSaveFn).toHaveBeenCalled();
			expect(questionInstance.handleNextQuestion).toHaveBeenCalled();
		});

		it('uploads multiple files', async () => {
			const mockSaveFn = jest.fn();
			req.files = { TestUpload: [makeTestFile('file1.pdf'), makeTestFile('file2.pdf')] };

			await questionInstance.saveAction(
				req,
				res,
				mockSaveFn,
				{ segment: 'seg', response: {} },
				{},
				journeyResponse
			);

			expect(uploadDocument).toHaveBeenCalledWith(
				'ref-1',
				expect.arrayContaining([
					expect.objectContaining({
						fileName: 'file1.pdf',
						id: 'doc1',
						location: '/docs/file1.pdf',
						name: 'file1.pdf',
						originalFileName: 'file1.pdf',
						size: '123',
						type: 'test'
					}),
					expect.objectContaining({
						fileName: 'file1.pdf',
						id: 'doc1',
						location: '/docs/file1.pdf',
						name: 'file1.pdf',
						originalFileName: 'file2.pdf',
						size: '123',
						type: 'test'
					})
				])
			);
			expect(multiFileUploadHelpers.removeFilesV2).toHaveBeenCalledTimes(0);
			expect(mockSaveFn).toHaveBeenCalled();
			expect(questionInstance.handleNextQuestion).toHaveBeenCalled();
		});

		it('uploads with existing files', async () => {
			const mockSaveFn = jest.fn();
			journeyResponse.answers.SubmissionDocumentUpload = [
				{ name: 'existing.pdf', originalFileName: 'existing.pdf', type: 'test' }
			];
			req.files = {
				TestUpload: [makeTestFile('file2.pdf')]
			};

			await questionInstance.saveAction(
				req,
				res,
				mockSaveFn,
				{ segment: 'seg', response: {} },
				{},
				journeyResponse
			);

			expect(uploadDocument).toHaveBeenCalledTimes(1);
			expect(multiFileUploadHelpers.removeFilesV2).toHaveBeenCalledTimes(0);
			expect(mockSaveFn).toHaveBeenCalled();
			expect(questionInstance.handleNextQuestion).toHaveBeenCalled();
		});

		it('renders action if checkForSavingErrors returns a view model', async () => {
			const mockSaveFn = jest.fn();
			const viewModel = { error: 'err' };
			questionInstance.checkForSavingErrors = jest.fn().mockReturnValue(viewModel);

			await questionInstance.saveAction(
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
