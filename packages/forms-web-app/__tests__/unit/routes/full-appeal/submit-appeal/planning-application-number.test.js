const { get, post } = require('../../router-mock');
const planningApplicationNumberController = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-application-number');
const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');
const {
	rules: applicationNumberValidationRules
} = require('../../../../../src/validators/full-appeal/application-number');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../../src/validators/full-appeal/application-number');
jest.mock('../../../../../src/controllers/full-appeal/submit-appeal/planning-application-number');

describe('routes/full-appeal/submit-appeal/planning-application-number', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/planning-application-number');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/planning-application-number',
			[fetchExistingAppealMiddleware],
			planningApplicationNumberController.getPlanningApplicationNumber()
		);
		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/planning-application-number',
			applicationNumberValidationRules(),
			validationErrorHandler,
			planningApplicationNumberController.postPlanningApplicationNumber()
		);
	});
});
