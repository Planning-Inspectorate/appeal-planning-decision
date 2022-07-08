const { get, post } = require('../../router-mock');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

const {
	getEmailConfirmed,
	postEmailConfirmed
} = require('../../../../../src/controllers/full-appeal/submit-appeal/email-address-confirmed');

describe('routes/full-appeal/submit-appeal/email-address-confirmed/:token', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/email-address-confirmed');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/email-address-confirmed/:token',
			[fetchExistingAppealMiddleware],
			getEmailConfirmed
		);
		expect(post).toHaveBeenCalledWith('/submit-appeal/email-address-confirmed/:token', postEmailConfirmed);
	});
});
