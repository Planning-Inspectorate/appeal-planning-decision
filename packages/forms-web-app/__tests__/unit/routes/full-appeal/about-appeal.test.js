const { get, post } = require('../router-mock');
const typeOfPlanningController = require('../../../../src/controllers/full-appeal/about-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
	rules: typeOfPlanningValidationRules
} = require('../../../../src/validators/full-appeal/about-appeal');

jest.mock('../../../../src/validators/full-appeal/about-appeal');

describe('routes/before-you-start/about-appeal', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/about-appeal');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/type-of-planning-application',
			[fetchExistingAppealMiddleware],
			typeOfPlanningController.redirectToNewAppealAboutUrl
		);

		expect(get).toHaveBeenCalledWith(
			'/about-appeal',
			[fetchExistingAppealMiddleware],
			typeOfPlanningController.getTypeOfPlanningApplication
		);

		expect(post).toHaveBeenCalledWith(
			'/about-appeal',
			typeOfPlanningValidationRules(),
			validationErrorHandler,
			typeOfPlanningController.postTypeOfPlanningApplication
		);
	});
});
