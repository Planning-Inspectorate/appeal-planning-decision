const {
	getConfirmEmailAddress
} = require('../../../../src/controllers/appeal-householder-decision/confirm-email-address');
const { createConfirmEmail } = require('../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../src/lib/appeals-api-wrapper');

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
			expect(res.render).toBeCalledWith('appeal-householder-decision/confirm-email-address', {
				emailAddress: 'test@example.com',
				resendLink: '/appeal-householder-decision/sent-another-link'
			});
		});
	});
});