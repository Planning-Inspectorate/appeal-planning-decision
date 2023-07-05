const { get } = require('../router-mock');
const yourAppealsController = require('../../../../src/controllers/lpa-dashboard/your-appeals');

jest.mock('../../../../src/controllers/lpa-dashboard/your-appeals');

describe('routes/lpa/your-appeals', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/your-appeals');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/your-appeals', yourAppealsController.getYourAppeals);
	});
});
