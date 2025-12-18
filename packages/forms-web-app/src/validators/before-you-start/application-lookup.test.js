const { validationResult } = require('express-validator');
const { rules } = require('./application-lookup');

describe('validators/before-you-start/application-lookup', () => {
	const runRules = async (req) => {
		const validators = rules();
		await Promise.all(validators.map((v) => v.run(req)));
		return validationResult(req);
	};

	it('should error when application-number is empty', async () => {
		const req = { body: { 'application-number': '' } };

		const result = await runRules(req);

		expect(result.isEmpty()).toBe(false);
		const errors = result.array();
		// Assert on error message (field name differs across versions)
		expect(errors[0].msg).toBe('Enter a valid application number');
	});

	it('should pass when application-number is provided', async () => {
		const req = { body: { 'application-number': 'APP-123' } };

		const result = await runRules(req);

		expect(result.isEmpty()).toBe(true);
	});
});
