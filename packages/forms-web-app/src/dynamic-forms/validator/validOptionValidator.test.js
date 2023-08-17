const ValidOptionValidator = require('./validOptionValidator');

describe('./src/dynamic-forms/validator/booleanValidator.test.js', () => {
	it('should build a ValidOptionValidator', () => {
		const vov = new ValidOptionValidator();
		const message = 'Please select an answer';
		const rule = vov.validate({}, message).builder.build();
		expect(rule.locations[0]).toEqual('body');
		expect(rule.stack[0].message).toEqual(message);
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
			options: ['apples', 'pears', 'oranges']
		};
		const validationResult = await new ValidOptionValidator()
			.validate(question, errorMessage)
			.run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(errorMessage);
	});
});
