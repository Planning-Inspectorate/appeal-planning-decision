const { get, post } = require('../router-mock');
const contactPlanningInspectorateController = require('../../../../src/controllers/before-you-start/contact-planning-inspectorate');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: contactPlanningInspectorateValidationRules
} = require('../../../../src/validators/before-you-start/contact-planning-inspectorate');

jest.mock('../../../../src/validators/before-you-start/contact-planning-inspectorate');

describe('routes/full-appeal/contact-planning-inspectorate', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/contact-planning-inspectorate');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/contact-planning-inspectorate',
			[fetchExistingAppealMiddleware],
			contactPlanningInspectorateController.getContactPlanningInspectorate
		);
		expect(post).toHaveBeenCalledWith(
			'/contact-planning-inspectorate',
			[fetchExistingAppealMiddleware],
			contactPlanningInspectorateValidationRules(),
			validationErrorHandler,
			contactPlanningInspectorateController.postContactPlanningInspectorate
		);
	});
});
