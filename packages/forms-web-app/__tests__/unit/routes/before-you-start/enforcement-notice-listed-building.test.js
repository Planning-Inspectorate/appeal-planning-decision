const { get } = require('../router-mock');
const enforcementNoticeListedBuildingController = require('../../../../src/controllers/before-you-start/enforcement-notice-listed-building');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../src/validators/before-you-start/enforcement-notice-listed-building');

describe('routes/full-appeal/enforcement-notice-listed-building', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/enforcement-notice-listed-building');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/enforcement-notice-listed-building',
			[fetchExistingAppealMiddleware],
			enforcementNoticeListedBuildingController.getEnforcementNoticeListedBuilding
		);
	});
});
