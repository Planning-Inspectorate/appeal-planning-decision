const { use } = require('../router-mock');
const newSavedAppealRouter = require('../../../../src/routes/appeal/new-saved-appeal');
const emailAddressRouter = require('../../../../src/routes/appeal/email-address');

describe('routes/appeal/index', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(newSavedAppealRouter);
		expect(use).toHaveBeenCalledWith(emailAddressRouter);
	});
});
