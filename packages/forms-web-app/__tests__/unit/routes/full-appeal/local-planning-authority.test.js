const { get, post } = require('../router-mock');
const localPlanningAuthorityController = require('../../../../src/controllers/full-appeal/local-planning-authority');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
	rules: localPlanningDepartmentAuthorityRules
} = require('../../../../src/validators/full-appeal/local-planning-authority');

jest.mock('../../../../src/validators/full-appeal/local-planning-authority');

describe('routes/full-appeal/local-planning-authority', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/local-planning-authority');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/local-planning-authority',
			[fetchExistingAppealMiddleware],
			localPlanningAuthorityController.getPlanningDepartment
		);

		expect(post).toHaveBeenCalledWith(
			'/local-planning-authority',
			localPlanningDepartmentAuthorityRules(),
			validationErrorHandler,
			localPlanningAuthorityController.postPlanningDepartment
		);
	});
});
