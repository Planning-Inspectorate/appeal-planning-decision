const { get, post } = require('../../router-mock');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

const {
	getEmailConfirmed,
	postEmailConfirmed
} = require('../../../../../src/controllers/full-appeal/submit-appeal/email-confirmed');

describe('routes/full-appeal/submit-appeal/email-confirmed/:token', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/email-confirmed');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/email-confirmed/:token',
			[fetchExistingAppealMiddleware],
			getEmailConfirmed
		);
		expect(post).toHaveBeenCalledWith('/submit-appeal/email-confirmed/:token', postEmailConfirmed);
	});
});
