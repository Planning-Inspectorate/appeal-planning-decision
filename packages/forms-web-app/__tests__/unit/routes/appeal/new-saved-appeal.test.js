const { get, post } = require('../router-mock');

const newSavedAppealController = require('../../../../src/controllers/appeal/new-saved-appeal');

const { rules: optionsValidationRules } = require('../../../../src/validators/common/options');

const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

const {
	constants: { NEW_OR_SAVED_APPEAL_OPTION }
} = require('@pins/business-rules');

jest.mock('../../../../src/validators/common/options');
jest.mock('../../../../src/validators/validation-error-handler');

describe('routes/appeal/new-saved-appeal', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal/new-saved-appeal');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/new-saved-appeal',
			[fetchExistingAppealMiddleware],
			newSavedAppealController.get
		);
		expect(post).toHaveBeenCalledWith(
			'/new-saved-appeal',
			optionsValidationRules(),
			validationErrorHandler,
			newSavedAppealController.post
		);

		expect(optionsValidationRules).toHaveBeenCalledWith({
			fieldName: 'new-or-saved-appeal',
			validOptions: Object.values(NEW_OR_SAVED_APPEAL_OPTION),
			emptyError: 'Select if you want to start a new appeal or return to a saved appeal'
		});
	});
});
