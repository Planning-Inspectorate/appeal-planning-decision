const { get, post } = require('../router-mock');
const emailAddressController = require('../../../../src/controllers/lpa-dashboard/email-address');

jest.mock('../../../../src/controllers/lpa-dashboard/email-address');

describe('routes/lpa/your-appeals', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/email-address');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/email-address', emailAddressController.getEmailAddress);
		expect(post).toHaveBeenCalledWith('/email-address', emailAddressController.postEmailAddress);
	});
});
