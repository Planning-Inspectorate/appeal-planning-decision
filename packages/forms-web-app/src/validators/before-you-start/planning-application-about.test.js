const { rules } = require('./planning-application-about');
const { validationResult } = require('express-validator');

jest.mock('@pins/business-rules/src/constants', () => ({
	APPLICATION_ABOUT: {
		OPTION_A: 'optionA',
		OPTION_B: 'optionB',
		OPTION_C: 'optionC'
	}
}));

const runValidation = async (body) => {
	const req = { body };
	const res = {};
	const next = jest.fn();
	for (const rule of rules()) {
		await rule.run(req, res, next);
	}
	return validationResult(req);
};

describe('ruleApplicationAbout', () => {
	it('fails when planningApplicationAbout is missing', async () => {
		const result = await runValidation({});
		expect(result.isEmpty()).toBe(false);
		expect(result.array()[0].msg).toBe('Select if your application was about any of the following');
	});

	it('fails when planningApplicationAbout is an invalid option', async () => {
		const result = await runValidation({ planningApplicationAbout: 'invalidOption' });
		expect(result.isEmpty()).toBe(false);
		expect(result.array()[0].msg).toBe('Select if your application was about any of the following');
	});

	it('passes when planningApplicationAbout is a valid single option', async () => {
		const result = await runValidation({ planningApplicationAbout: 'optionA' });
		expect(result.isEmpty()).toBe(true);
	});

	it('passes when planningApplicationAbout is an array of valid options', async () => {
		const result = await runValidation({ planningApplicationAbout: ['optionA', 'optionB'] });
		expect(result.isEmpty()).toBe(true);
	});

	it('fails when planningApplicationAbout contains a mix of valid and invalid options', async () => {
		const result = await runValidation({ planningApplicationAbout: ['optionA', 'invalidOption'] });
		expect(result.isEmpty()).toBe(false);
		expect(result.array()[0].msg).toBe('Select if your application was about any of the following');
	});

	it('fails when planningApplicationAbout is an empty array', async () => {
		const result = await runValidation({ planningApplicationAbout: [] });
		expect(result.isEmpty()).toBe(false);
		expect(result.array()[0].msg).toBe('Select if your application was about any of the following');
	});
});
