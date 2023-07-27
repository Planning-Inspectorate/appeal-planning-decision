const { get, post } = require('../router-mock');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

describe('routes/lpa/your-email-address', () => {
	beforeEach(() => {
		require('../../../../src/routes/lpa-dashboard/your-email-address');
	});
	afterEach(() => {
		jest.resetAllMocks();
	});
	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/your-email-address/:id', expect.any(Function));
		expect(post).toHaveBeenCalledWith(
			'/your-email-address/:id',
			[expect.any(Function)],
			validationErrorHandler,
			expect.any(Function)
		);
	});
});
