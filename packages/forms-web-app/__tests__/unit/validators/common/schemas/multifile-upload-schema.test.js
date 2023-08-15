const schema = require('../../../../../src/validators/common/schemas/multifile-upload-schema');
const validateFileSize = require('../../../../../src/validators/custom/file-size');
const config = require('../../../../../src/config');

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

		it('should throw error if a file is invalid mimetype', async () => {
			try {
				await fn({ mimetype: 'not/valid', name: 'pingu.penguin' });
			} catch (err) {
				expect(err.message).toEqual('pingu.penguin must be a DOC, DOCX, PDF, TIF, JPG or PNG');
			}
		});

		it('should call the validateFileSize validator', async () => {
			await fn({
				mimetype: config.fileUpload.pins.allowedFileTypes.MIME_TYPE_JPEG,
				name: 'pingu.penguin',
				size: 12345
			});
			expect(validateFileSize).toHaveBeenCalledWith(
				12345,
				config.fileUpload.pins.supportingDocumentsMaxFileSize,
				'pingu.penguin'
			);
		});
	});
});
