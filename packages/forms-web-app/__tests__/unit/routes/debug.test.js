const { get } = require('./router-mock');
const { setCommentDeadline } = require('../../../src/controllers/debug');

describe('routes/debug', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../src/routes/debug');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/set-comment-deadline', setCommentDeadline);
	});
});
