const { get } = require('../router-mock');
jest.mock('../../../../src/controllers/final-comment/appeal-closed-for-comment');
const {
	getAppealClosedForComment
} = require('../../../../src/controllers/final-comment/appeal-closed-for-comment');

describe('routes/final-comment/appeal-closed-for-comment', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/final-comment/appeal-closed-for-comment');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/appeal-closed-for-comment', getAppealClosedForComment);
	});
});
