const { use } = require('../router-mock');

const enterAppealDetailsRouter = require('../../../../src/routes/submit-appeal/enter-appeal-details');
const applicationSavedRouter = require('../../../../src/routes/submit-appeal/application-saved');

describe('routes/submit-appeal', () => {
	beforeEach(() => {
		jest.resetModules();

		// eslint-disable-next-line global-require
		require('../../../../src/routes/submit-appeal/index');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(enterAppealDetailsRouter);
		expect(use).toHaveBeenCalledWith(applicationSavedRouter);
	});
});
