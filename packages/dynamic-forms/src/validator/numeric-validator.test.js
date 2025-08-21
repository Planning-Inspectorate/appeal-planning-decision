const NumericValidator = require('./numeric-validator');

describe('src/dynamic-forms/validator/numeric-validator.js', () => {
	it('should invalidate a value below the minimum', async () => {
		const options = {
			min: 1,
			minMessage: 'The value must be at least 1',
			fieldName: 'value'
		};
		const req = {
			body: {
				value: '0'
			}
		};
		const question = {
			fieldName: 'value'
		};

		const validationResult = await new NumericValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(options.minMessage);
	});

	it('should invalidate a value above the maximum', async () => {
		const options = {
			max: 100,
			maxMessage: 'The value must not exceed 100',
			fieldName: 'value'
		};
		const req = {
			body: {
				value: '101'
			}
		};
		const question = {
			fieldName: 'value'
		};

		const validationResult = await new NumericValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(options.maxMessage);
	});

	it('should invalidate non-numeric input', async () => {
		const options = {
			regex: /^\d+$/,
			regexMessage: 'Only numeric digits are allowed',
			fieldName: 'value'
		};
		const req = {
			body: {
				value: 'abc'
			}
		};
		const question = {
			fieldName: 'value'
		};
		const validationResult = await new NumericValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(options.regexMessage);
	});

	it('should validate a correct numeric value within range', async () => {
		const options = {
			min: 1,
			max: 100,
			regex: /^\d+$/,
			fieldName: 'value'
		};
		const req = {
			body: {
				value: '50'
			}
		};
		const question = {
			fieldName: 'value'
		};

		const validationResult = await new NumericValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(0);
	});
});
