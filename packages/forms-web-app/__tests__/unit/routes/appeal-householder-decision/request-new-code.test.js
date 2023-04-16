const { get, post } = require('../router-mock');
const requestNewCodeController = require('../../../../src/controllers/common/request-new-code');

jest.mock('../../../../src/controllers/common/request-new-code');

describe('routes/appeal-householder-decision/request-new-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/request-new-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/request-new-code',
			requestNewCodeController.getRequestNewCode()
		);
		expect(post).toHaveBeenCalledWith(
			'/request-new-code',
			requestNewCodeController.postRequestNewCode()
		);
	});
});
