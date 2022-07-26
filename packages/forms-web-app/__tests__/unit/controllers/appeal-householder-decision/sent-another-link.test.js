const {
	getSentAnotherLink
} = require('../../../../src/controllers/appeal-householder-decision/sent-another-link');
const { createConfirmEmail } = require('../../../../src/lib/appeals-api-wrapper');

const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/appeal-householder-decision/sent-another-link', () => {
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
			req.session.appeal = fakeAppeal;
			await getSentAnotherLink(req, res);
			expect(createConfirmEmail).toBeCalledWith(fakeAppeal);
			expect(res.render).toBeCalledWith('appeal-householder-decision/sent-another-link', {
				appeal: fakeAppeal
			});
		});
	});
});
