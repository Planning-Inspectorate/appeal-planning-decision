const { get } = require('../router-mock');

describe('routes/appeal-householder-planning/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/lpa-dashboard');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenNthCalledWith(1, '/service-invite/:lpaCode', expect.any(Function));
		expect(get).toHaveBeenNthCalledWith(2, '/', expect.any(Function));
		expect(get).toHaveBeenNthCalledWith(3, '/enter-email', expect.any(Function));
	});
});
