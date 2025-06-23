const { get, post } = require('../../router-mock');
const {
	getTellingTheLandowners,
	postTellingTheLandowners
} = require('../../../../../src/controllers/full-appeal/submit-appeal/telling-the-landowners');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');
const { buildCheckboxValidation } = require('../../../../../src/validators/common/checkboxes');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/checkboxes');

describe('routes/full-appeal/submit-appeal/telling-the-landowners', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/telling-the-landowners');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/telling-the-landowners',
			[fetchExistingAppealMiddleware],
			getTellingTheLandowners
		);

		expect(buildCheckboxValidation).toHaveBeenCalledTimes(1);

		const firsCall = post.mock.calls[0];
		expect(firsCall.length).toEqual(4);
		expect(firsCall[0]).toEqual('/submit-appeal/telling-the-landowners');
		expect(firsCall[2]).toEqual(validationErrorHandler);
		expect(firsCall[3]).toEqual(postTellingTheLandowners);
	});
});
