const { get } = require('../router-mock');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

const {
	getSentAnotherLink
} = require('../../../../src/controllers/appeal-householder-decision/sent-another-link');

describe('routes/appeal-householder-decision/sent-another-link', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/sent-another-link');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/sent-another-link',
			[fetchExistingAppealMiddleware],
			getSentAnotherLink
		);
	});
});
