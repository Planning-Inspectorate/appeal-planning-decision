const { get } = require('../router-mock');

const emailAddressController = require('../../../../src/controllers/appeal/email-address');

describe('routes/appeal/email-address', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal/email-address');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/email-address', emailAddressController.get);
	});
});
