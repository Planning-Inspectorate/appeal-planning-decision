const schema = require('./multifile-upload-schema');
const validateFileSize = require('../file-size');

const MIME_TYPE_JPEG = 'image/jpeg';
const MIME_TYPE_DOC = 'application/msword';
const oneGigabyte = 1024 * 1024 * 1024;

jest.mock('../file-size');
const mockScan = jest.fn();
const mockGetClamClient = () => {
	return { scan: mockScan };
};

describe('validators/common/schemas/multifile-upload-schema', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const testParams = {
		path: 'files.upload-documents.*',
		allowedFileTypes: [MIME_TYPE_JPEG, MIME_TYPE_DOC],
		maxUploadSize: oneGigabyte,
		getClamAVClient: mockGetClamClient
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
				expect(err.message).toEqual('pingu.penguin must be a DOC, DOCX, PDF, TIF, JPG or PNG');
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

		it('should call the antivirus validator', async () => {
			const payload = {
				mimetype: MIME_TYPE_JPEG,
				name: 'pingu.penguin',
				size: 12345
			};

			await fn(payload);

			expect(mockScan).toHaveBeenCalledTimes(1);
			expect(mockScan).toHaveBeenCalledWith(payload, payload.name);
		});
	});
});
