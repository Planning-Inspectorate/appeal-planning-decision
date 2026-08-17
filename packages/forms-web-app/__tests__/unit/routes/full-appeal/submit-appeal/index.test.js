const { use } = require('../../router-mock');
const planningApplicationNumberRouter = require('../../../../../src/routes/full-appeal/submit-appeal/planning-application-number');
const emailConfirmedRouter = require('../../../../../src/routes/full-appeal/submit-appeal/email-address-confirmed');
const requestNewCodeRouter = require('../../../../../src/routes/full-appeal/login/request-new-code');
const codeExpiredRouter = require('../../../../../src/routes/full-appeal/login/code-expired');

describe('routes/full-appeal/submit-appeal/index', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal');
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(planningApplicationNumberRouter);
		expect(use).toHaveBeenCalledWith(emailConfirmedRouter);
		expect(use).toHaveBeenCalledWith(requestNewCodeRouter);
		expect(use).toHaveBeenCalledWith(codeExpiredRouter);
	});
});
