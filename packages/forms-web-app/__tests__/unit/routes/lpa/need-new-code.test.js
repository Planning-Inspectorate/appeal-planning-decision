const { get, post } = require('../router-mock');
const needNewCodeController = require('../../../../src/controllers/common/need-new-code');

jest.mock('../../../../src/controllers/common/need-new-code');

describe('routes/lpa/request-new-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/need-new-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/need-new-code/:id', needNewCodeController.getNeedNewCode());
		expect(post).toHaveBeenCalledWith(
			'/need-new-code/:id',
			needNewCodeController.postNeedNewCode()
		);
	});
});
