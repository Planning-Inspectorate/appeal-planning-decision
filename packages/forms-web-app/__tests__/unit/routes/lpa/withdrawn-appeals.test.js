const { get } = require('../router-mock');
const withdrawnAppealsController = require('../../../../src/controllers/lpa-dashboard/withdrawn-appeals');

describe('routes/lpa-dashboard/withdrawn-appeals', () => {
	beforeEach(() => {
		require('../../../../src/routes/lpa-dashboard/withdrawn-appeals');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/withdrawn-appeals',
			withdrawnAppealsController.getWithdrawnAppeals
		);
	});
});
