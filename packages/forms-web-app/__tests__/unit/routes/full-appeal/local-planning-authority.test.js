const { get, post } = require('../router-mock');
const localPlanningDepartmentController = require('../../../../src/controllers/full-appeal/local-planning-department');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const {
	rules: localPlanningDepartmentValidationRules
} = require('../../../../src/validators/full-appeal/local-planning-department');

jest.mock('../../../../src/validators/full-appeal/local-planning-department');

describe('routes/full-appeal/local-planning-department', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/local-planning-authority');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/local-planning-authority',
			[fetchExistingAppealMiddleware],
			localPlanningDepartmentController.getPlanningDepartment
		);

		expect(post).toHaveBeenCalledWith(
			'/local-planning-authority',
			localPlanningDepartmentValidationRules(),
			validationErrorHandler,
			localPlanningDepartmentController.postPlanningDepartment
		);
	});
});
