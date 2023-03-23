const { validMimeType } = require('pins-mime-validation');
const schema = require('../../../../../src/validators/common/schemas/multifile-upload-schema');
const validateFileSize = require('../../../../../src/validators/custom/file-size');
const {
	MIME_TYPE_DOC,
	MIME_TYPE_DOCX,
	MIME_TYPE_PDF,
	MIME_TYPE_JPEG,
	MIME_TYPE_TIF,
	MIME_TYPE_PNG
} = require('../../../../../src/lib/mime-types');
const config = require('../../../../../src/config');

jest.mock('pins-mime-validation');
jest.mock('../../../../../src/validators/custom/file-size');
jest.mock('../../../../../src/config');

describe('validators/common/schemas/multifile-upload-schema', () => {
	it('has a defined custom schema object', () => {
		let newSchema = schema('files.supporting-documents.*');
		expect(newSchema['files.supporting-documents.*'].custom.options).toBeDefined();
	});

	describe(`schema[path].custom.options`, () => {
		let fn;

		beforeEach(() => {
			let newSchema = schema('files.upload-documents.*');
			fn = newSchema['files.upload-documents.*'].custom.options;
		});

		it('should call the validMimeType validator', () => {
			fn({ mimetype: MIME_TYPE_PNG, name: 'pingu.penguin' });
			expect(validMimeType).toHaveBeenCalledWith(
				MIME_TYPE_PNG,
				[
					MIME_TYPE_DOC,
					MIME_TYPE_DOCX,
					MIME_TYPE_PDF,
					MIME_TYPE_JPEG,
					MIME_TYPE_TIF,
					MIME_TYPE_PNG
				],
				'pingu.penguin must be a DOC, DOCX, PDF, TIF, JPG or PNG'
			);
		});

		it('should call the validateFileSize validator', async () => {
			await fn({ mimetype: MIME_TYPE_JPEG, name: 'pingu.penguin', size: 12345 });
			expect(validateFileSize).toHaveBeenCalledWith(
				12345,
				config.fileUpload.pins.supportingDocumentsMaxFileSize,
				'pingu.penguin'
			);
		});
	});
});
