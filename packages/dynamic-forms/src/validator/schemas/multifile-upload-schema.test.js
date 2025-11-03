const schema = require('./multifile-upload-schema');
const validateFileSize = require('../file-size');

const MIME_TYPE_JPEG = 'image/jpeg';
const MIME_TYPE_DOC = 'application/msword';
const oneGigabyte = 1024 * 1024 * 1024;

jest.mock('../file-size');

describe('validators/common/schemas/multifile-upload-schema', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const testParams = {
		path: 'files.upload-documents.*',
		allowedFileTypes: [MIME_TYPE_JPEG, MIME_TYPE_DOC],
		maxUploadSize: oneGigabyte
	};

	it('has a defined custom schema object', () => {
		let newSchema = schema(testParams);
		expect(newSchema[testParams.path].custom.options).toBeDefined();
	});

	describe(`schema[path].custom.options`, () => {
		let fn;

		beforeEach(() => {
			let newSchema = schema(testParams);
			fn = newSchema[testParams.path].custom.options;
		});

		it('should throw error if a file is invalid mimetype', async () => {
			try {
				await fn({ mimetype: 'not/valid', name: 'pingu.penguin' });
			} catch (err) {
				expect(err.message).toEqual(
					'pingu.penguin must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX'
				);
			}
		});

		it('should call the validateFileSize validator', async () => {
			await fn({
				mimetype: MIME_TYPE_JPEG,
				name: 'pingu.penguin',
				size: 12345
			});
			expect(validateFileSize).toHaveBeenCalledWith(
				12345,
				testParams.maxUploadSize,
				'pingu.penguin'
			);
		});
	});
});
