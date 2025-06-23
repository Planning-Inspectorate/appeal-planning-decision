const {
	getAppealAlreadySubmitted
} = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-already-submitted');

const {
	VIEW: {
		FULL_APPEAL: { APPEAL_ALREADY_SUBMITTED }
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/appeal-already-submitted', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getAppealAlreadySubmitted', () => {
		it('calls correct template', async () => {
			await getAppealAlreadySubmitted(req, res);
			expect(res.render).toHaveBeenCalledWith(APPEAL_ALREADY_SUBMITTED, {});
		});
	});
});
