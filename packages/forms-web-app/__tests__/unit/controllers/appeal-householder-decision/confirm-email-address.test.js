const {
	getConfirmEmailAddress
} = require('../../../../src/controllers/appeal-householder-decision/confirm-email-address');
const { createConfirmEmail } = require('../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../src/lib/appeals-api-wrapper');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { SENT_ANOTHER_LINK, CONFIRM_EMAIL_ADDRESS }
	}
} = require('../../../../src/lib/views');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/appeal-householder-decision/confirm-email-address', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getConfirmEmailAddress', () => {
		it('calls correct template', async () => {
			req.session.appeal.email = 'test@example.com';
			await getConfirmEmailAddress(req, res);
			expect(createConfirmEmail).toBeCalledWith(req.session.appeal);
			expect(res.render).toBeCalledWith(`${CONFIRM_EMAIL_ADDRESS}`, {
				emailAddress: 'test@example.com',
				resendLink: SENT_ANOTHER_LINK
			});
		});
	});
});
