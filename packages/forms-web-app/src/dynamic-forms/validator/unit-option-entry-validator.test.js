const { validationResult } = require('express-validator');
const UnitOptionEntryValidator = require('./unit-option-entry-validator');

const question = {
	fieldName: 'test',
	conditionalFieldName: 'testConditional',
	options: [
		{
			text: 'testUnit one',
			value: 'testUnitOne',
			conditional: {
				fieldName: 'testConditional_one',
				suffix: 'testUnitOne'
			}
		},
		{
			text: 'testUnit two',
			value: 'testUnitTwo',
			conditional: {
				fieldName: 'testConditional_two',
				suffix: 'testUnitTwo'
			}
		}
	]
};
const errorMessage = 'There must be an input to test';
const unit = 'Test unit';

describe('src/dynamic-forms/validator/numeric-validator.js', () => {
	it('should invalidate an empty value', async () => {
		const options = {
			errorMessage,
			unit,
			min: 1
		};
		const req = {
			body: {
				test: 'testUnitOne'
			}
		};

		const errors = await _validationMappedErrors(req, options);
		expect(Object.keys(errors).length).toEqual(1);
		expect(errors['testConditional_one'].msg).toEqual(errorMessage);
	});

	it('should invalidate a value below the minimum', async () => {
		const options = {
			errorMessage,
			unit,
			min: 1
		};
		const req = {
			body: {
				test: 'testUnitOne',
				testConditional_one: 0
			}
		};

		const expectedMinMessage = 'Test unit must be at least 1testUnitOne';

		const errors = await _validationMappedErrors(req, options);
		expect(Object.keys(errors).length).toEqual(1);
		expect(errors['testConditional_one'].msg).toEqual(expectedMinMessage);
	});

	it('should invalidate a value above the maximum', async () => {
		const options = {
			errorMessage,
			unit,
			max: 100
		};
		const req = {
			body: {
				test: 'testUnitTwo',
				testConditional_two: 101
			}
		};

		const expectedMaxMessage = 'Test unit must be 100testUnitTwo or less';

		const errors = await _validationMappedErrors(req, options);
		expect(Object.keys(errors).length).toEqual(1);
		expect(errors['testConditional_two'].msg).toEqual(expectedMaxMessage);
	});

	it('should invalidate non-numeric input', async () => {
		const options = {
			errorMessage,
			unit,
			regex: /^\d+$/,
			regexMessage: 'Only numeric digits are allowed'
		};
		const req = {
			body: {
				test: 'testUnitOne',
				testConditional_one: 'u'
			}
		};

		const errors = await _validationMappedErrors(req, options);
		expect(Object.keys(errors).length).toEqual(1);
		expect(errors['testConditional_one'].msg).toEqual(options.regexMessage);
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
				test: 'testUnitOne',
				testConditional_one: 50
			}
		};

		const errors = await _validationMappedErrors(req, options);
		expect(Object.keys(errors).length).toEqual(0);
	});
});

const _validationMappedErrors = async (req, options) => {
	const unitOptionEntryValidator = new UnitOptionEntryValidator(options);

	const validationRules = unitOptionEntryValidator.validate(question);

	await Promise.all(validationRules.map((validator) => validator.run(req)));

	const errors = validationResult(req);

	return errors.mapped();
};
