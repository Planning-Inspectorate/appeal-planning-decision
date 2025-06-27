const { get } = require('../../router-mock');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

const {
	getAppealAlreadySubmitted
} = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-already-submitted');

describe('routes/full-appeal/submit-appeal/appeal-already-submitted', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/appeal-already-submitted');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/appeal-already-submitted',
			[fetchExistingAppealMiddleware],
			getAppealAlreadySubmitted
		);
	});
});
