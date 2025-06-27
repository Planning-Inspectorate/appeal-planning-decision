const { get } = require('../router-mock');
const {
	getEmailConfirmed
} = require('../../../../src/controllers/appeal-householder-decision/email-address-confirmed');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
describe('routes/appeal-householder-decision/email-address-confirmed', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/email-address-confirmed');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/email-address-confirmed',
			[fetchExistingAppealMiddleware],
			getEmailConfirmed
		);
	});
});
