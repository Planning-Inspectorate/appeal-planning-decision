const ConfirmationCheckboxValidator = require('./confirmation-checkbox-validator');
describe('./src/dynamic-forms/validator/confirmation-checkbox-validator.js', () => {
	it('should return an error if the checkbox has not been checked', () => {
		const validator = new ConfirmationCheckboxValidator({
			checkboxName: 'testBox',
			errorMessage: 'test error message'
		});
		const rule = validator.validate({}).builder.build();
		expect(rule.locations[0]).toEqual('body');
		expect(rule.stack[0].message).toEqual(validator.errorMessage);
		expect(rule.stack[0].validator.name).toEqual('isEmpty');
	});

	it('should not return an error message if the checkbox has been checked', async () => {
		const req = {
			body: {
				testBox: 'yes'
			}
		};
		const question = {
			textEntryCheckbox: {
				name: 'testBox'
			}
		};

		const validator = new ConfirmationCheckboxValidator({
			checkboxName: 'testBox',
			errorMessage: 'test error message'
		});
		const validationResult = await validator.validate(question).run(req);
		expect(validationResult.errors.length).toEqual(0);
	});
});
