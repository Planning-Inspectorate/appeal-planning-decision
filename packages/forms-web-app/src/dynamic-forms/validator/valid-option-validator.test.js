const ValidOptionValidator = require('./valid-option-validator');

describe('./src/dynamic-forms/validator/valid-option-validator.js', () => {
	it('should build a ValidOptionValidator', () => {
		const vov = new ValidOptionValidator();
		const rule = vov.validate({}).builder.build();
		expect(rule.locations[0]).toEqual('body');
		expect(rule.stack[0].message).toEqual(vov.errorMessage);
		expect(rule.stack[0].validator.name).toEqual('');
	});
	it('should return an error message if the field value is not in the list of options defined on the question', async () => {
		const req = {
			body: {
				favouriteFruit: 'bananas'
			}
		};
		const errorMessage = 'Please select only from the supplied options';
		const question = {
			fieldName: 'favouriteFruit',
			options: [
				{ text: 'Apples', value: 'apples' },
				{ text: 'Pears', value: 'pears' },
				{ text: 'Oranges', values: 'oranges' }
			]
		};
		const validationResult = await new ValidOptionValidator(errorMessage)
			.validate(question)
			.run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(errorMessage);
	});
	it('should not return an error message if the field value is in the list of options defined on the question', async () => {
		const req = {
			body: {
				favouriteFruit: 'apples'
			}
		};
		const question = {
			fieldName: 'favouriteFruit',
			options: [
				{ text: 'Apples', value: 'apples' },
				{ text: 'Pears', value: 'pears' },
				{ text: 'Oranges', values: 'oranges' }
			]
		};
		const validationResult = await new ValidOptionValidator().validate(question).run(req);
		expect(validationResult.errors.length).toEqual(0);
	});
});