const schema = require('../../../../../src/validators/common/schemas/check-document-uploaded-schema');

const { findTargetValueInJSON } = require('../../../../../src/lib/find-target-value-in-json');

jest.mock('../../../../../src/lib/find-target-value-in-json');

describe('validators/common/schemas/check-document-upload-schema', () => {
	let fn;
	let req;

	beforeEach(() => {
		let newSchema = schema(
			'upload-documents',
			'supportingDocuments',
			'finalComment',
			'custom error'
		);
		fn = newSchema['upload-documents'].custom.options;
		req = {
			session: { finalComment: {} },
			files: {},
			body: { removedFiles: null }
		};
	});

	it('should return true if req.files contains files', async () => {
		req.files = { 'upload-documents': { name: 'document.jpg' } };

		const result = await fn(null, { req });
		expect(result).toBe(true);
	});

	it('should return true if req.files does not contain files but there are uploaded files', async () => {
		req.files = null;
		req.session.finalComment.supportingDocuments = { uploadedFiles: [{ name: 'document.jpg' }] };

		findTargetValueInJSON.mockReturnValueOnce(req.session.finalComment.supportingDocuments);

		const result = await fn(null, { req });

		expect(findTargetValueInJSON).toHaveBeenCalledTimes(1);
		expect(findTargetValueInJSON).toHaveBeenCalledWith(
			req.session.finalComment,
			'supportingDocuments',
			'sectionStates'
		);
		expect(result).toBe(true);
	});

	it('should return true if there are uploaded files and only some are being removed', async () => {
		req.files = null;
		req.session.finalComment.supportingDocuments = {
			uploadedFiles: [{ name: 'document2.jpg' }, { name: 'document3.jpg' }]
		};
		req.body.removedFiles = '[{"name": "document2.jpg"}]';

		findTargetValueInJSON.mockReturnValueOnce(req.session.finalComment.supportingDocuments);

		const result = await fn(null, { req });

		expect(findTargetValueInJSON).toHaveBeenCalledTimes(1);
		expect(findTargetValueInJSON).toHaveBeenCalledWith(
			req.session.finalComment,
			'supportingDocuments',
			'sectionStates'
		);
		expect(result).toBe(true);
	});

	it('should throw error if there are uploaded files but all are being removed', async () => {
		req.files = null;
		req.session.finalComment.supportingDocuments = {
			uploadedFiles: [{ name: 'document.jpg' }, { name: 'anotherDoc.png' }]
		};
		req.body.removedFiles = '[{"name": "document.jpg"}, {"name": "anotherDoc.png"}]';

		findTargetValueInJSON.mockReturnValueOnce(req.session.finalComment.supportingDocuments);

		let thrownError;

		try {
			await fn(null, { req });
		} catch (error) {
			thrownError = error;
		}

		expect(thrownError).toEqual(new Error('custom error'));
	});

	it('should throw error if no files being uploaded/already uploaded', async () => {
		// if supporting documents is empty
		req.files = null;
		req.session.finalComment.supportingDocuments = [];

		findTargetValueInJSON.mockReturnValueOnce(req.session.finalComment.supportingDocuments);

		let thrownError;

		try {
			await fn(null, { req });
		} catch (error) {
			thrownError = error;
		}

		expect(thrownError).toEqual(new Error('custom error'));

		// if supporting documents has uploaded files field but it is empty
		req.files = null;
		req.session.finalComment.supportingDocuments = { uploadedFiles: [] };

		findTargetValueInJSON.mockReturnValueOnce(req.session.finalComment.supportingDocuments);

		try {
			await fn(null, { req });
		} catch (error) {
			thrownError = error;
		}

		expect(thrownError).toEqual(new Error('custom error'));

		//if custom error message not specified, uses default error message
		let defaultErrorMessageSchema = schema(
			'upload-documents',
			'supportingDocuments',
			'finalComment'
		);
		fn = defaultErrorMessageSchema['upload-documents'].custom.options;

		req.files = null;
		req.session.finalComment.supportingDocuments = { uploadedFiles: [] };

		findTargetValueInJSON.mockReturnValueOnce(req.session.finalComment.supportingDocuments);

		try {
			await fn(null, { req });
		} catch (error) {
			thrownError = error;
		}

		expect(thrownError).toEqual(new Error('Select a file to upload'));
	});
});
