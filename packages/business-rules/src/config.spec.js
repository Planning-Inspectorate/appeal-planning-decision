const config = require('./config');
const constants = require('./constants');
const householderAppeal = require('../test/data/householder-appeal');
const fullAppeal = require('../test/data/full-appeal');

describe('config', () => {
	const { APPEAL_ID } = constants;

	process.env.APP_APPEALS_BASE_URL = 'http://localhost';
	fullAppeal.submissionDate = new Date();

	it('should return correct confirmEmail config for full appeal', () => {
		const result = config.appeal.type[APPEAL_ID.PLANNING_SECTION_78].email.confirmEmail(
			fullAppeal,
			process.env.APP_APPEALS_BASE_URL
		);
		expect(result).toEqual({
			recipientEmail: fullAppeal.email,
			reference: fullAppeal.id,
			variables: {
				link: 'http://localhost/full-appeal/submit-appeal/email-address-confirmed'
			}
		});
	});
	it('should return correct confirmEmail config for householder appeal', () => {
		const result = config.appeal.type[APPEAL_ID.HOUSEHOLDER].email.confirmEmail(
			householderAppeal,
			process.env.APP_APPEALS_BASE_URL
		);
		expect(result).toEqual({
			recipientEmail: householderAppeal.email,
			reference: householderAppeal.id,
			variables: { link: 'http://localhost/appeal-householder-decision/email-address-confirmed' }
		});
	});
});
