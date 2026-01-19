const { get } = require('../router-mock');

const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const canUseServiceController = require('../../../../src/controllers/before-you-start/can-use-service');

describe('routes/before-you-start/can-use-service', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/can-use-service');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/can-use-service',
			[fetchExistingAppealMiddleware, checkDecisionDateDeadline],
			canUseServiceController.getCanUseService
		);
	});
});
