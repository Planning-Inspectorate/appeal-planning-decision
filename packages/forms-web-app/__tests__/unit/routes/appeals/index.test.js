const { use } = require('../router-mock');
const yourAppealsRouter = require('../../../../src/routes/appeals/your-appeals');

describe('routes/appeals/index', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeals');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith('/your-appeals', yourAppealsRouter);
	});
});
