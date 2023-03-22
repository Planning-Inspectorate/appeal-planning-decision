const { get, post } = require('../router-mock');
jest.mock('../../../../src/controllers/final-comment/final-comment');
jest.mock('../../../../src/validators/validation-error-handler');
jest.mock('../../../../src/validators/final-comment/final-comment');
const {
	getAddFinalComment,
	postAddFinalComment
} = require('../../../../src/controllers/final-comment/final-comment');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: finalCommentValidationRules
} = require('../../../../src/validators/final-comment/final-comment');

describe('routes/final-comment/final-comment', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/final-comment/final-comment');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/final-comment', getAddFinalComment);
		expect(post).toHaveBeenCalledWith(
			'/final-comment',
			finalCommentValidationRules(),
			validationErrorHandler,
			postAddFinalComment
		);
		expect(finalCommentValidationRules).toHaveBeenCalled();
	});
});
