const { get, post } = require('../router-mock');
const contactPlanningInspectorateDateController = require('../../../../src/controllers/before-you-start/contact-planning-inspectorate-date');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const combineDateInputsMiddleware = require('../../../../src/middleware/combine-date-inputs');
const convertMonthNameToNumber = require('../../../../src/middleware/convert-month-name-to-number');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: enforcementIssueDateValidationRules
} = require('../../../../src/validators/before-you-start/contact-planning-inspectorate-date');

jest.mock('../../../../src/validators/before-you-start/contact-planning-inspectorate-date');

describe('routes/full-appeal/contact-planning-inspectorate-date', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/contact-planning-inspectorate-date');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/contact-planning-inspectorate-date',
			[fetchExistingAppealMiddleware],
			contactPlanningInspectorateDateController.getContactPlanningInspectorateDate
		);
		expect(post).toHaveBeenCalledWith(
			'/contact-planning-inspectorate-date',
			[fetchExistingAppealMiddleware, convertMonthNameToNumber, combineDateInputsMiddleware],
			enforcementIssueDateValidationRules(),
			validationErrorHandler,
			contactPlanningInspectorateDateController.postContactPlanningInspectorateDate
		);
	});
});
