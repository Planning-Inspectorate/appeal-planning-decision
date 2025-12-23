const { validationResult } = require('express-validator');
const { rules } = require('./application-not-found');

describe('validators/before-you-start/application-not-found', () => {
	const runRules = async (req) => {
		const validators = rules();
		await Promise.all(validators.map((v) => v.run(req)));
		return validationResult(req);
	};

	it('should error when confirm-application-number is empty', async () => {
		const req = { body: { 'confirm-application-number': '' } };

		const result = await runRules(req);

		expect(result.isEmpty()).toBe(false);
		const errors = result.array();
		expect(errors[0].msg).toBe('Confirm your application number');
	});

	it('should pass when confirm-application-number is provided', async () => {
		const req = { body: { 'confirm-application-number': 'APP-123' } };

		const result = await runRules(req);

		expect(result.isEmpty()).toBe(true);
	});
});
