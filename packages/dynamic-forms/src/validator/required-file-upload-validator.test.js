const RequiredFileUploadValidator = require('./required-file-upload-validator');

describe('./src/dynamic-forms/validator/required-file-upload-validator.js', () => {
	describe('validate', () => {
		it('should have a rule for path featuring fieldName', () => {
			const requiredFileUploadValidator = new RequiredFileUploadValidator();

			const rule = requiredFileUploadValidator
				.validate({
					fieldName: 'test-field-name',
					documentType: 'test-doc-type'
				})
				.builder.build();

			expect(rule.fields).toEqual(['test-field-name']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(1);
			expect(rule.stack[0].validator.name).toEqual('options');
			expect(rule.stack[0].validator.negated).toBeFalsy();
		});

		it('should pass if file being uploaded', async () => {
			const questionObj = {
				fieldName: 'test-fieldname',
				documentType: 'test-doc-type'
			};
			const journeyResponse = {};
			const req = { files: { test: 'test123' } };

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(0);
		});

		it('should pass if no file being uploaded and file matching question document type already uploaded', async () => {
			const questionObj = {
				fieldName: 'another-test-fieldname',
				documentType: 'test-doc-type'
			};
			const uploadedFile = {
				file: 'already-uploaded',
				type: 'test-doc-type'
			};
			const journeyResponse = {
				answers: { SubmissionDocumentUpload: [uploadedFile] }
			};
			const req = { body: {} };

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(0);
		});

		it('should fail if no file being uploaded and no file matching question document type already uploaded', async () => {
			const questionObj = {
				fieldName: 'yet-another-test-fieldname',
				documentType: 'test-doc-type'
			};
			const journeyResponse = { answers: { SubmissionDocumentUpload: [] } };
			const req = { body: {} };

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(1);
		});

		it('should fail if no file being uploaded matching question doc type and all existing files matching doc type being removed', async () => {
			const questionObj = {
				fieldName: 'test-fieldname',
				documentType: 'test-doc-type'
			};

			const journeyResponse = {
				answers: {
					SubmissionDocumentUpload: [
						{
							file: 'to-be-removed',
							type: 'test-doc-type'
						},
						{
							file: 'to-be-removed-too',
							type: 'test-doc-type'
						}
					]
				}
			};
			const req = { body: {} };
			req.body.removedFiles =
				'[{"file": "to-be-removed", "type": "test-doc-type"}, {"file": "to-be-removed-too", "type": "test-doc-type"}]';
			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(1);
		});

		it('should pass if existing files matching question doc type and only some being removed', async () => {
			const questionObj = {
				fieldName: 'test-fieldname',
				documentType: 'test-doc-type'
			};
			const journeyResponse = {
				answers: {
					SubmissionDocumentUpload: [
						{
							file: 'to-be-removed',
							type: 'test-doc-type'
						},
						{
							file: 'to-be-kept',
							type: 'test-doc-type'
						}
					]
				}
			};
			const req = { body: {} };
			req.body.removedFiles = '[{"file": "to-be-removed", "type": "test-doc-type"}]';

			const requiredFileUploadValidator = new RequiredFileUploadValidator();
			const validationResult = await requiredFileUploadValidator
				.validate(questionObj, journeyResponse)
				.run(req);

			expect(validationResult.errors).toHaveLength(0);
		});
	});
});
