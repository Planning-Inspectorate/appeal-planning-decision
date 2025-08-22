const RequiredValidator = require('./required-validator');
describe('./src/dynamic-forms/validator/required-validator.js', () => {
	it('should return an error message if the boolean field is missing', () => {
		const rv = new RequiredValidator();
		const rule = rv.validate({}).builder.build();
		expect(rule.locations[0]).toEqual('body');
		expect(rule.stack[0].message).toEqual(rv.errorMessage);
		expect(rule.stack[0].validator.name).toEqual('isEmpty');
	});

	it('should use custom error message', () => {
		const customError = 'error';
		const rv = new RequiredValidator(customError);
		const rule = rv.validate({}).builder.build();
		expect(rule.locations[0]).toEqual('body');
		expect(rule.stack[0].message).toEqual(customError);
		expect(rule.stack[0].validator.name).toEqual('isEmpty');
	});

	it('should not return an error message if the field value is present', async () => {
		const req = {
			body: {
				favouriteFruit: 'apples'
			}
		};
		const question = {
			fieldName: 'favouriteFruit'
		};

		const rv = new RequiredValidator();
		const validationResult = await rv.validate(question).run(req);
		expect(validationResult.errors.length).toEqual(0);
	});
});
