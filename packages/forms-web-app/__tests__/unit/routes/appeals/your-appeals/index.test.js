const { get, use } = require('../../router-mock');

const yourAppealsController = require('../../../../../src/controllers/appeals/your-appeals');
const decidedAppealsRouter = require('../../../../../src/routes/appeals/your-appeals/decided-appeals');

describe('routes/appeals/your-appeals', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/appeals/your-appeals');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/', yourAppealsController.get);
		expect(use).toHaveBeenCalledWith(decidedAppealsRouter);
	});
});
