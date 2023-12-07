const { get, post } = require('../router-mock');

const commonEnterCodeController = require('../../../../src/controllers/common/enter-code');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, APPEAL_ALREADY_SUBMITTED, EMAIL_CONFIRMED },
		APPEAL: { EMAIL_ADDRESS, REQUEST_NEW_CODE, CODE_EXPIRED, NEED_NEW_CODE, ENTER_CODE },
		APPEALS: { YOUR_APPEALS },
		COMMON
	}
} = require('../../../../src/lib/views');
const { rules: ruleEnterCode } = require('../../../../src/validators/common/enter-code');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

jest.mock('../../../../src/controllers/common/enter-code');
jest.mock('../../../../src/validators/common/enter-code');
jest.mock('../../../../src/validators/validation-error-handler');

describe('routes/appeal/enter-code', () => {
	const views = {
		TASK_LIST,
		ENTER_CODE_URL: ENTER_CODE,
		REQUEST_NEW_CODE,
		CODE_EXPIRED,
		NEED_NEW_CODE,
		APPEAL_ALREADY_SUBMITTED,
		EMAIL_CONFIRMED,
		EMAIL_ADDRESS,
		YOUR_APPEALS,
		ENTER_CODE: COMMON.ENTER_CODE
	};

	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/enter-code', commonEnterCodeController.getEnterCode(views));

		expect(post).toHaveBeenCalledWith(
			'/enter-code',
			ruleEnterCode(),
			validationErrorHandler,
			commonEnterCodeController.postEnterCode(views)
		);
	});
});
