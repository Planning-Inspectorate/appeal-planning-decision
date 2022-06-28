const { get } = require('../../router-mock');
const {
	getConfirmEmailAddress
} = require('../../../../../src/controllers/full-appeal/submit-appeal/confirm-email-address');

describe('routes/full-appeal/submit-appeal/confirm-email-address', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/confirm-email-address');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/confirm-email-address',
			getConfirmEmailAddress
		);
	});
});
