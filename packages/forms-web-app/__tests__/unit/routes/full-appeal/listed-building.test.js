const { get, post } = require('../router-mock');
const listedBuildingController = require('../../../../src/controllers/full-appeal/listed-building');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
	rules: listedBuildingValidationRules
} = require('../../../../src/validators/full-appeal/listed-building');

jest.mock('../../../../src/validators/full-appeal/listed-building');

describe('routes/full-appeal/listed-building', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/full-appeal/listed-building');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/listed-building',
			fetchExistingAppealMiddleware,
			listedBuildingController.getListedBuilding
		);

		expect(post).toHaveBeenCalledWith(
			'/listed-building',
			listedBuildingValidationRules(),
			validationErrorHandler,
			listedBuildingController.postListedBuilding
		);
	});
});
