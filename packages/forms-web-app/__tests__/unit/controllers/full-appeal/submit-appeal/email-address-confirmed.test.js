const {
	getEmailConfirmed
} = require('../../../../../src/controllers/full-appeal/submit-appeal/email-address-confirmed');

const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED }
	}
} = require('../../../../../src/lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/full-appeal/submit-appeal/email-address-confirmed', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getEmailConfirmed', () => {
		it('calls correct template: token valid, V1 routes', async () => {
			isLpaInFeatureFlag.mockResolvedValueOnce(false);

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/full-appeal/submit-appeal/list-of-documents'
			});
		});

		it('calls correct template: token valid, V2 routes', async () => {
			isLpaInFeatureFlag.mockResolvedValueOnce(true);

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/appeals/full-planning/appeal-form/before-you-start'
			});
		});
	});
});
