const {
	getSentAnotherLink
} = require('../../../../../src/controllers/full-appeal/submit-appeal/sent-another-link');
const { createConfirmEmail } = require('../../../../../src/lib/appeals-api-wrapper');

const {
	VIEW: {
		FULL_APPEAL: { SENT_ANOTHER_LINK }
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/sent-another-link', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getSentAnotherLink', () => {
		it('calls correct template', async () => {
			const fakeAppeal = { appeal: 'fake-appeal' };
			const typeOfPlanningApplication = req.session.appeal;
			req.session.appeal = fakeAppeal;
			await getSentAnotherLink(req, res);
			expect(createConfirmEmail).toBeCalledWith(fakeAppeal);
			expect(res.render).toBeCalledWith(SENT_ANOTHER_LINK, { 
				appeal: fakeAppeal, 
				typeOfPlanningApplication 
		});
	});
});
