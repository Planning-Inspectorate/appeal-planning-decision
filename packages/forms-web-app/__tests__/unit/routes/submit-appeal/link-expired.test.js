const { get } = require('../router-mock');

const linkExpiredController = require('../../../../src/controllers/submit-appeal/link-expired');

describe('routes/submit-appeal/link-expired', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/submit-appeal/link-expired');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/link-expired', linkExpiredController.getLinkExpired);
	});
});
