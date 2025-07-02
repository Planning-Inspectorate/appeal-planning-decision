const MultifileUploadValidator = require('./multifile-upload-validator');
const mockGetClamClient = () => {
	return { scan: jest.fn };
};

const MIME_TYPE_JPEG = 'image/jpeg';
const MIME_TYPE_DOC = 'application/msword';
const oneGigabyte = 1024 * 1024 * 1024;

describe('./src/dynamic-forms/validator/multifile-upload-validator.js', () => {
	const testParams = {
		allowedFileTypes: [MIME_TYPE_JPEG, MIME_TYPE_DOC],
		maxUploadSize: oneGigabyte,
		getClamAVClient: mockGetClamClient
	};

	describe('validate', () => {
		it('should have a rule for path featuring fieldName', () => {
			const multifileUploadValidator = new MultifileUploadValidator(testParams);

			const rule = multifileUploadValidator
				.validate({ fieldName: 'test-field-name' })
				.builder.build();

			expect(rule.fields).toEqual(['files.test-field-name.*']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(1);
			expect(rule.stack[0].validator.name).toEqual('options');
			expect(rule.stack[0].validator.negated).toBeFalsy();
		});

		it('should pass if valid files', async () => {
			const req = {
				body: {
					files: {
						'some-question': [
							{
								mimetype: MIME_TYPE_JPEG,
								name: 'file1.jpeg',
								size: 12345
							},
							{
								mimetype: MIME_TYPE_DOC,
								name: 'file2.doc',
								size: 12345
							}
						]
					}
				}
			};

			const question = {
				fieldName: 'some-question'
			};

			const multifileUploadValidator = new MultifileUploadValidator(testParams);

			const validationResult = await multifileUploadValidator.validate(question).run(req);

			expect(validationResult.errors).toHaveLength(0);
		});

		// Checks that errors are returned for files with an incorrect mime type and too big in size
		it('should return errors for invalid files', async () => {
			const req = {
				body: {
					files: {
						'another-question': [
							{
								mimetype: 'invalid-mimetype',
								name: 'invalidFile1wrongMimeType.jpeg',
								size: 12345
							},
							{
								mimetype: MIME_TYPE_DOC,
								name: 'invalidFile2tooBig.doc',
								size: oneGigabyte + 1
							},
							{
								mimetype: MIME_TYPE_JPEG,
								name: 'validFile.jpeg',
								size: 12345
							}
						]
					}
				}
			};

			const question = {
				fieldName: 'another-question'
			};

			const multifileUploadValidator = new MultifileUploadValidator(testParams);

			const validationResult = await multifileUploadValidator.validate(question).run(req);

			expect(validationResult.errors).toHaveLength(2);
		});

		it('should pass if body undefined or empty', async () => {
			const req = {
				body: {}
			};

			const question = {
				fieldName: 'some-question'
			};

			const multifileUploadValidator = new MultifileUploadValidator(testParams);

			const validationResult = await multifileUploadValidator.validate(question).run(req);

			expect(validationResult.errors).toHaveLength(0);
		});

		it('should pass if files key is empty', async () => {
			const req = {
				body: { files: [] }
			};

			const question = {
				fieldName: 'some-question'
			};

			const multifileUploadValidator = new MultifileUploadValidator(testParams);

			const validationResult = await multifileUploadValidator.validate(question).run(req);

			expect(validationResult.errors).toHaveLength(0);
		});

		it('should pass if files path not matched', async () => {
			const req = {
				body: {
					files: {
						'another-file-path': [{ mimetype: 'not-valid' }]
					}
				}
			};

			const question = {
				fieldName: 'not-the-same-file-path'
			};

			const multifileUploadValidator = new MultifileUploadValidator(testParams);

			const validationResult = await multifileUploadValidator.validate(question).run(req);

			expect(validationResult.errors).toHaveLength(0);
		});
	});
});
