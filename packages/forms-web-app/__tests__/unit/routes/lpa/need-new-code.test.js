const { get, post } = require('../router-mock');
const needNewCodeController = require('../../../../src/controllers/common/need-new-code');

jest.mock('../../../../src/controllers/common/need-new-code');

const mockedGet = 'getNeedNewCode';
const mockedPost = 'postNeedNewCodeLPA';

describe('routes/lpa/request-new-code', () => {
	beforeEach(() => {
		needNewCodeController.getNeedNewCode.mockReturnValue(mockedGet);
		needNewCodeController.postNeedNewCodeLPA.mockReturnValue(mockedPost);
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/need-new-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/need-new-code', mockedGet);
		expect(post).toHaveBeenCalledWith('/need-new-code', mockedPost);
	});
});
