const { get, post } = require('../router-mock');
jest.mock('../../../../src/controllers/final-comment/check-your-answers');
const {
	getCheckYourAnswers,
	postCheckYourAnswers
} = require('../../../../src/controllers/final-comment/check-your-answers');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

describe('routes/final-comment/check-your-answers', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/final-comment/check-your-answers');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/check-your-answers', getCheckYourAnswers);
		expect(post).toHaveBeenCalledWith(
			'/check-your-answers',
			validationErrorHandler,
			postCheckYourAnswers
		);
	});
});
