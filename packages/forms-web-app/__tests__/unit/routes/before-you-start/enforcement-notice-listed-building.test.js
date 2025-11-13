const { get, post } = require('../router-mock');
const enforcementNoticeListedBuildingController = require('../../../../src/controllers/before-you-start/enforcement-notice-listed-building');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: enforcementNoticeListedBuildingValidationRules
} = require('../../../../src/validators/before-you-start/enforcement-notice-listed-building');

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
		expect(post).toHaveBeenCalledWith(
			'/enforcement-notice-listed-building',
			[fetchExistingAppealMiddleware],
			enforcementNoticeListedBuildingValidationRules(),
			validationErrorHandler,
			enforcementNoticeListedBuildingController.postEnforcementNoticeListedBuilding
		);
	});
});
