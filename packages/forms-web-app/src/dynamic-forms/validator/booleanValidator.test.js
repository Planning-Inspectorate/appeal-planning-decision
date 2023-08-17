const BooleanValidator = require('./booleanValidator');
describe('./src/dynamic-forms/validator/booleanValidator.test.js', () => {
	it('should return an error message if the boolean field is missing', () => {
		const bv = new BooleanValidator();
		const message = 'Please select an answer';
		const rule = bv.validate({}, message).builder.build();
		expect(rule.locations[0]).toEqual('body');
		expect(rule.stack[0].message).toEqual(message);
		expect(rule.stack[0].validator.name).toEqual('isEmpty');
	});
});
