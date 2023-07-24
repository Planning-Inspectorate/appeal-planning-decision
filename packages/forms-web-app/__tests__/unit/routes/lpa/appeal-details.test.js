const { get } = require('../router-mock');
const AppealDetailsController = require('../../../../src/controllers/lpa-dashboard/appeal-details');

jest.mock('../../../../src/controllers/lpa-dashboard/appeal-details');

describe('routes/lpa/your-appeals', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/appeal-details');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/appeal-details/:id',
			AppealDetailsController.getAppealDetails
		);
	});
});
