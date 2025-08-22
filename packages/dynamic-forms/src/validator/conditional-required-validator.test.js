const ConditionalRequiredValidator = require('./conditional-required-validator');
describe('./src/dynamic-forms/validator/conditional-required-validator.js', () => {
	const question = {
		fieldName: 'test',
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'conditional question',
					fieldName: 'testValue',
					label: 'test label',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	};

	it('should return an error message if parent field value selected has a condition and conditional field is empty', async () => {
		const req = {
			body: {
				test: 'yes'
			}
		};

		const validator = new ConditionalRequiredValidator();
		const validationRules = validator.validate(question);
		const validationResult = await validationRules[0].run(req);
		expect(validationRules.length).toEqual(1);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual('Provide further information');
	});

	it('should not return an error message if parent field value selected has no condition', async () => {
		const req = {
			body: {
				test: 'no'
			}
		};

		const validator = new ConditionalRequiredValidator();
		const validationRules = validator.validate(question);
		const validationResult = await validationRules[0].run(req);
		expect(validationRules.length).toEqual(1);
		expect(validationResult.errors.length).toEqual(0);
	});
});
