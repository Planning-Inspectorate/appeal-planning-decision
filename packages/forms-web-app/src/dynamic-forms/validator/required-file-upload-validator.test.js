const RequiredFileUploadValidator = require('./required-file-upload-validator');

describe('./src/dynamic-forms/validator/required-file-upload-validator.js', () => {
	describe('validate', () => {
		it('should have a rule for path featuring fieldName', () => {
			const requiredFileUploadValidator = new RequiredFileUploadValidator();

			const rule = requiredFileUploadValidator
				.validate({ fieldName: 'test-field-name' })
				.builder.build();

			expect(rule.fields).toEqual(['test-field-name']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(1);
			expect(rule.stack[0].validator.name).toEqual('options');
			expect(rule.stack[0].validator.negated).toBeFalsy();
		});

		it('should pass if file being uploaded', async () => {
			const questionObj = { fieldName: 'test-fieldname' };
			const journeyResponse = { 'test-fieldname': { uploadedFiles: null } };
			const req = { files: { test: 'test123' } };

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(0);
		});

		it('should pass if no file being uploaded and file matching path already uploaded', async () => {
			const questionObj = { fieldName: 'another-test-fieldname' };
			const journeyResponse = {
				answers: { 'another-test-fieldname': { uploadedFiles: [{ file: 'already-uploaded' }] } }
			};
			const req = { body: {} };

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(0);
		});

		it('should fail if no file being uploaded and no file matching path already uploaded', async () => {
			const questionObj = { fieldName: 'yet-another-test-fieldname' };
			const journeyResponse = { answers: { 'yet-another-test-fieldname': { uploadedFiles: [] } } };
			const req = { body: {} };

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(1);
		});

		it('should fail if no file being uploaded matching path and all existing files matching path being removed', async () => {
			const questionObj = { fieldName: 'test-fieldname' };
			const journeyResponse = {
				answers: {
					'test-fieldname': {
						uploadedFiles: [{ file1: 'to-be-removed' }, { file2: 'to-be-removed-too' }]
					}
				}
			};
			const req = { body: {} };
			req.body.removedFiles = '[{"file1": "to-be-removed"}, {"file2": "to-be-removed-too"}]';
			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(1);
		});

		it('should pass if existing files matching path and only some being removed', async () => {
			const questionObj = { fieldName: 'test-fieldname' };
			const journeyResponse = {
				answers: {
					'test-fieldname': { uploadedFiles: [{ file1: 'to-be-removed' }, { file2: 'to-keep' }] }
				}
			};
			const req = { body: {} };
			req.body.removedFiles = '[{"file1": "to-be-removed"}]';

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(0);
		});
	});
});
