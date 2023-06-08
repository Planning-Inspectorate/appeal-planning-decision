const { use } = require('../router-mock');

const codeExpiredRouter = require('../../../../src/routes/appeal-householder-decision/code-expired');

describe('routes/appeal-householder-decision/index', () => {
	beforeEach(() => {
		jest.resetModules();

		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/index');
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(codeExpiredRouter);
	});
});
