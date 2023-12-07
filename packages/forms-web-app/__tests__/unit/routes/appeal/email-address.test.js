const { get } = require('../router-mock');

const commonEmailAddressController = require('../../../../src/controllers/common/email-address');
const {
	VIEW: {
		APPEAL: { EMAIL_ADDRESS, ENTER_CODE }
	}
} = require('../../../../src/lib/views');

jest.mock('../../../../src/controllers/common/email-address');

describe('routes/appeal/email-address', () => {
	const views = {
		EMAIL_ADDRESS,
		ENTER_CODE
	};

	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal/email-address');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/email-address',
			commonEmailAddressController.getEmailAddress(views)
		);
	});
});
