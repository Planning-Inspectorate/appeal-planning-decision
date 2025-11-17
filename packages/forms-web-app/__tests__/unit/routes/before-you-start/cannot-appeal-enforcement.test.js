const { get } = require('../router-mock');

const {
	getCannotAppealEnforcement
} = require('../../../../src/controllers/before-you-start/cannot-appeal-enforcement');

describe('routes/before-you-start/use-existing-service-enforcement-notice', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/cannot-appeal-enforcement');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/cannot-appeal-enforcement', getCannotAppealEnforcement);
	});
});
