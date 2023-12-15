const { get } = require('../../router-mock');

const decidedAppealsController = require('../../../../../src/controllers/appeals/your-appeals/decided-appeals');

describe('routes/appeals/your-appeals', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/appeals/your-appeals/decided-appeals');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/decided-appeals', decidedAppealsController.get);
	});
});
