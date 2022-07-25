const { use } = require('../router-mock');

const linkExpiredRouter = require('../../../../src/routes/appeal-householder-decision/link-expired');

describe('routes/appeal-householder-decision/index', () => {
	beforeEach(() => {
		jest.resetModules();

		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/index');
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(linkExpiredRouter);
	});
});
