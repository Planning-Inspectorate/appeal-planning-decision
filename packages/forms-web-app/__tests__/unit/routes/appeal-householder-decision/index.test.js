const { use } = require('../router-mock');

const linkExpiredRouter = require('../../../../src/routes/appeal-householder-decision/link-expired');
const codeExpiredRouter = require('../../../../src/routes/appeal-householder-decision/code-expired');
const sentAnotherLinkRouter = require('../../../../src/routes/appeal-householder-decision/sent-another-link');

describe('routes/appeal-householder-decision/index', () => {
	beforeEach(() => {
		jest.resetModules();

		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/index');
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(linkExpiredRouter);
		expect(use).toHaveBeenCalledWith(codeExpiredRouter);
		expect(use).toHaveBeenCalledWith(sentAnotherLinkRouter);
	});
});
