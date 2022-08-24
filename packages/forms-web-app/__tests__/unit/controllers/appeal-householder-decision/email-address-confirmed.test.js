const {
	getEmailConfirmed
} = require('../../../../src/controllers/appeal-householder-decision/email-address-confirmed');
const { getConfirmEmail } = require('../../../../src/lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../../../src/lib/is-token-expired');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { EMAIL_ADDRESS_CONFIRMED, LINK_EXPIRED }
	}
} = require('../../../../src/lib/views');

const { mockReq, mockRes } = require('../../mocks');
jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/is-token-expired');

describe('controllers/appeal-householder-decision/email-address-confirmed', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getEmailConfirmed', () => {
		it('calls correct template: token valid', async () => {
			req.session.appeal.id = '12345-abc';
			const date = new Date('2022-05-11T17:19:37.227Z');
			getConfirmEmail.mockReturnValue({ createdAt: '2022-05-11T17:19:37.227Z' });
			isTokenExpired.mockReturnValue(false);
			await getEmailConfirmed(req, res);
			expect(getConfirmEmail).toBeCalledWith('12345-abc');
			expect(isTokenExpired).toBeCalledWith(30, date);
			expect(res.render).toBeCalledWith(EMAIL_ADDRESS_CONFIRMED, {
				listOfDocumentsUrl: 'list-of-documents'
			});
		});

		it('calls correct template: token expired', async () => {
			req.session.appeal.id = '12345-def';
			const date = new Date('2022-05-11T17:19:37.227Z');
			getConfirmEmail.mockReturnValue({
				createdAt: '2022-05-11T17:19:37.227Z',
				appealId: '12345-def'
			});
			isTokenExpired.mockReturnValue(true);
			await getEmailConfirmed(req, res);
			expect(getConfirmEmail).toBeCalledWith('12345-def');
			expect(isTokenExpired).toBeCalledWith(30, date);
			expect(res.render).not.toBeCalled();
			expect(res.redirect).toBeCalledWith(`/${LINK_EXPIRED}`);
		});
	});
});
