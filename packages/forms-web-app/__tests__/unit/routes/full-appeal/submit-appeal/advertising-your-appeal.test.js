const { get, post } = require('../../router-mock');
const {
	getAdvertisingYourAppeal,
	postAdvertisingYourAppeal
} = require('../../../../../src/controllers/full-appeal/submit-appeal/advertising-your-appeal');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');
const { buildCheckboxValidation } = require('../../../../../src/validators/common/checkboxes');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/checkboxes');

describe('routes/full-appeal/submit-appeal/advertising-your-appeal', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/advertising-your-appeal');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/advertising-your-appeal',
			[fetchExistingAppealMiddleware],
			getAdvertisingYourAppeal
		);

		expect(buildCheckboxValidation).toHaveBeenCalledTimes(1);

		const firsCall = post.mock.calls[0];
		expect(firsCall.length).toEqual(4);
		expect(firsCall[0]).toEqual('/submit-appeal/advertising-your-appeal');
		expect(firsCall[2]).toEqual(validationErrorHandler);
		expect(firsCall[3]).toEqual(postAdvertisingYourAppeal);
	});
});
