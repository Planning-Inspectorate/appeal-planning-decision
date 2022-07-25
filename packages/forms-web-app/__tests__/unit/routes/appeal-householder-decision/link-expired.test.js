const { get } = require('../router-mock');

const linkExpiredController = require('../../../../src/controllers/appeal-householder-decision/link-expired');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

describe('routes/appeal-householder-decision/link-expired', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/link-expired');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/link-expired',
			[fetchExistingAppealMiddleware],
			linkExpiredController.getLinkExpired
		);
	});
});
