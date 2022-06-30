const { get } = require('../../router-mock');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

const {
	getSentAnotherLink
} = require('../../../../../src/controllers/full-appeal/submit-appeal/sent-another-link');

describe('routes/full-appeal/submit-appeal/email-confirmed', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/sent-another-link');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/sent-another-link',
			[fetchExistingAppealMiddleware],
			getSentAnotherLink
		);
	});
});
