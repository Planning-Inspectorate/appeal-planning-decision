const {
	getConfirmEmailAddress
} = require('../../../../../src/controllers/full-appeal/submit-appeal/confirm-email-address');
const { createConfirmEmail } = require('../../../../../src/lib/appeals-api-wrapper');
const appeal = require('@pins/business-rules/test/data/full-appeal');

const {
	VIEW: {
		FULL_APPEAL: { CONFIRM_EMAIL_ADDRESS }
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/confirm-email-address', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getConfirmEmailAddress', () => {
		it('calls correct template', async () => {
			req.session.appeal = appeal;
			req.session.appeal.email = 'test@example.com';
			await getConfirmEmailAddress(req, res);
			expect(createConfirmEmail).toBeCalledWith(appeal);
			expect(res.render).toBeCalledWith(CONFIRM_EMAIL_ADDRESS, {
				emailAddress: 'test@example.com'
			});
		});
	});
});
