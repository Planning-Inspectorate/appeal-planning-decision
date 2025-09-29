const { validationResult } = require('express-validator');
const MultiFieldInputValidator = require('./multi-field-input-validator');

const testRequiredField1 = {
	fieldName: 'testField1',
	errorMessage: 'test message 1',
	minLength: {
		minLength: 3,
		minLengthMessage: 'test min length message'
	},
	maxLength: {
		maxLength: 10,
		maxLengthMessage: 'test max length message'
	},
	regex: {
		regex: '^\\d',
		regexMessage: 'test regex message 1'
	},
	lessThan: {
		lessThan: 124,
		lessThanMessage: 'test less than message'
	}
};

const testRequiredField2 = {
	fieldName: 'testField2',
	errorMessage: 'test message 2'
};

const singleRequiredField = {
	requiredFields: [testRequiredField1]
};

const multipleRequiredFields = {
	requiredFields: [testRequiredField1, testRequiredField2]
};

describe('src/dynamic-forms/validator/multi-field-input-validator.js', () => {
	it('should throw if no required fields passed to constructor', () => {
		// eslint-disable-next-line no-unused-vars
		expect(() => {
			new MultiFieldInputValidator();
		}).toThrow('MultiFieldInput validator is invoked without any required fields');
	});
	it('should validate a request that has required fields in the right format', async () => {
		const req = {
			body: {
				testField1: '123',
				testField2: '1'
			}
		};

		const errors = await _validationMappedErrors(req, multipleRequiredFields);
		expect(Object.keys(errors).length).toEqual(0);
	});

	it('should invalidate a missing required field', async () => {
		const req = {
			body: {}
		};

		const errors = await _validationMappedErrors(req, singleRequiredField);

		const testField1Errors = errors.find((e) => e.path === testRequiredField1.fieldName);

		expect(Object.keys(errors).length).toEqual(1);
		expect(testField1Errors?.msg).toBe(testRequiredField1.errorMessage);
	});

	it('should only invalidate a missing required field for multipleRequiredFields', async () => {
		const req = {
			body: {}
		};

		const errors = await _validationMappedErrors(req, multipleRequiredFields);

		const testField1Errors = errors.find((e) => e.path === testRequiredField1.fieldName);
		const testField2Errors = errors.find((e) => e.path === testRequiredField2.fieldName);

		expect(Object.keys(errors).length).toEqual(2);
		expect(testField1Errors?.msg).toBe(testRequiredField1.errorMessage);
		expect(testField2Errors?.msg).toBe(testRequiredField2.errorMessage);
	});

	it('should invalidate multiple missing required fields', async () => {
		const req = {
			body: {
				testField3: 'this field is optional'
			}
		};

		const errors = await _validationMappedErrors(req, multipleRequiredFields);

		const testField1Errors = errors.find((e) => e.path === testRequiredField1.fieldName);
		const testField2Errors = errors.find((e) => e.path === testRequiredField2.fieldName);

		expect(Object.keys(errors).length).toEqual(2);
		expect(testField1Errors?.msg).toBe(testRequiredField1.errorMessage);
		expect(testField2Errors?.msg).toBe(testRequiredField2.errorMessage);
	});

	it('should invalidate a required entry that is too short', async () => {
		const req = {
			body: {
				testField1: '12'
			}
		};

		const errors = await _validationMappedErrors(req, singleRequiredField);

		const testField1Errors = errors.find((e) => e.path === testRequiredField1.fieldName);

		expect(Object.keys(errors).length).toEqual(1);
		expect(testField1Errors?.msg).toBe(testRequiredField1.minLength.minLengthMessage);
	});

	it('should invalidate a required entry that is too long', async () => {
		const req = {
			body: {
				testField1: '12345678901'
			}
		};

		const errors = await _validationMappedErrors(req, singleRequiredField);

		const testField1Errors = errors.filter((e) => e.path === testRequiredField1.fieldName);

		expect(Object.keys(errors).length).toEqual(2);
		expect(testField1Errors[0]?.msg).toBe(testRequiredField1.maxLength.maxLengthMessage);
		expect(testField1Errors[1]?.msg).toBe(testRequiredField1.lessThan.lessThanMessage);
	});

	it('should invalidate a required entry that fails a regex requirement', async () => {
		const req = {
			body: {
				testField1: 'FIVE'
			}
		};

		const errors = await _validationMappedErrors(req, singleRequiredField);

		const testField1Errors = errors.filter((e) => e.path === testRequiredField1.fieldName);

		expect(Object.keys(errors).length).toEqual(2);
		expect(testField1Errors[0]?.msg).toBe(testRequiredField1.regex.regexMessage);
		expect(testField1Errors[1]?.msg).toBe(testRequiredField1.lessThan.lessThanMessage);
	});

	it('should invalidate a required entry that fails a less than requirement', async () => {
		const req = {
			body: {
				testField1: '125'
			}
		};

		const errors = await _validationMappedErrors(req, singleRequiredField);

		const testField1Errors = errors.find((e) => e.path === testRequiredField1.fieldName);

		expect(Object.keys(errors).length).toEqual(1);
		expect(testField1Errors?.msg).toBe(testRequiredField1.lessThan.lessThanMessage);
	});

	it('should invalidate a supplied required entry that fails multiple validation requirements and return all errors', async () => {
		const req = {
			body: {
				testField1: 'as',
				testField2: ''
			}
		};

		const errors = await _validationMappedErrors(req, multipleRequiredFields);

		const testField1Errors = errors.filter((e) => e.path === testRequiredField1.fieldName);
		const testField2Errors = errors.find((e) => e.path === testRequiredField2.fieldName);

		expect(Object.keys(errors).length).toEqual(4);

		expect(testField1Errors.length).toEqual(3);
		expect(testField1Errors.map((e) => e.msg)).toEqual([
			testRequiredField1.minLength.minLengthMessage,
			testRequiredField1.regex.regexMessage,
			testRequiredField1.lessThan.lessThanMessage
		]);

		expect(testField2Errors).toBeDefined();
		expect(testField2Errors?.msg).toBe(testRequiredField2.errorMessage);
	});
});

const _validationMappedErrors = async (req, options) => {
	const multiFieldInputValidator = new MultiFieldInputValidator(options);

	const validationRules = multiFieldInputValidator.validate();

	await Promise.all(validationRules.map((validator) => validator.run(req)));

	const errors = validationResult(req);

	return errors.array();
};
