const { use, get } = require('../router-mock');
const { skipMiddlewareForPaths } = require('../../../../src/middleware/skip-middleware-for-paths');
const featureFlagMiddleware = require('../../../../src/middleware/feature-flag');
const requireUser = require('../../../../src/middleware/lpa-dashboard/require-user');

jest.mock('../../../../src/middleware/skip-middleware-for-paths');
jest.mock('../../../../src/middleware/feature-flag');
jest.mock('../../../../src/middleware/lpa-dashboard/require-user');

describe('routes/manage-appeals', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/index');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(featureFlagMiddleware('lpa-dashboard'));

		expect(use).toHaveBeenCalledWith(
			skipMiddlewareForPaths(requireUser, [
				'service-invite',
				'enter-code',
				'request-new-code',
				'need-new-code',
				'code-expired',
				'enter-email'
			])
		);

		expect(get).toHaveBeenCalledWith('/enter-email', expect.any(Function));
	});
});
