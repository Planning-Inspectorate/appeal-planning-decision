const { get, post } = require('../router-mock');

jest.mock('../../../../src/controllers/final-comment/comments-question');
jest.mock('../../../../src/validators/validation-error-handler');
jest.mock('../../../../src/validators/common/options');

const {
	getCommentsQuestion,
	postCommentsQuestion
} = require('../../../../src/controllers/final-comment/comments-question');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../src/validators/common/options');

describe('routes/final-comment/comments-question', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/final-comment/comments-question');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/comments-question', getCommentsQuestion);
		expect(post).toHaveBeenCalledWith(
			'/comments-question',
			optionsValidationRules(),
			validationErrorHandler,
			postCommentsQuestion
		);
		expect(optionsValidationRules).toHaveBeenCalledWith({
			emptyError: 'Select yes to enter your final comment',
			fieldName: 'comments-question'
		});
	});
});
