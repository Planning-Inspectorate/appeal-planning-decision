const { get, post } = require('../../router-mock');
const requestNewCodeController = require('../../../../../src/controllers/common/request-new-code');

jest.mock('../../../../../src/controllers/common/request-new-code');

describe('routes/full-appeal/submit-appeal/request-new-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/request-new-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/request-new-code',
			requestNewCodeController.getRequestNewCode()
		);
		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/request-new-code',
			requestNewCodeController.postRequestNewCode()
		);

		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/need-new-code',
			requestNewCodeController.getRequestNewCode()
		);
		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/need-new-code',
			requestNewCodeController.postRequestNewCode()
		);
	});
});
