const {
	getSentAnotherLink
} = require('../../../../../src/controllers/full-appeal/submit-appeal/sent-another-link');
const {
	getExistingAppeal,
	createConfirmEmail
} = require('../../../../../src/lib/appeals-api-wrapper');

const {
	VIEW: {
		FULL_APPEAL: { SENT_ANOTHER_LINK: currentPage }
	}
} = require('../../../../../src/lib/full-appeal/views');

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
			req.session = { confirmEmailId: 'fake-id-123456' };
			getExistingAppeal.mockReturnValue(fakeAppeal);
			await getSentAnotherLink(req, res);
			expect(getExistingAppeal).toBeCalledWith('fake-id-123456');
			expect(createConfirmEmail).toBeCalledWith(fakeAppeal);
			expect(res.render).toBeCalledWith(currentPage, { appeal: fakeAppeal });
			expect(req.session.confirmEmailId).toBeNull();
		});
	});
});
