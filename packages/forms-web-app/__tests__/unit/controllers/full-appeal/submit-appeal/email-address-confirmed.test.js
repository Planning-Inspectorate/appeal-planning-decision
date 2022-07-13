const {
	getEmailConfirmed
} = require('../../../../../src/controllers/full-appeal/submit-appeal/email-address-confirmed');
const { getConfirmEmail } = require('../../../../../src/lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../../../../src/lib/is-token-expired');

const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED }
	}
} = require('../../../../../src/lib/full-appeal/views');
const {
	VIEW: {
		SUBMIT_APPEAL: { LINK_EXPIRED }
	}
} = require('../../../../../src/lib/submit-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');
jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/is-token-expired');

describe('controllers/full-appeal/submit-appeal/email-address-confirmed', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getEmailConfirmed', () => {
		it('calls correct template: token valid', async () => {
			req.params.token = '12345';
			const date = new Date('2022-05-11T17:19:37.227Z');
			getConfirmEmail.mockReturnValue({ createdAt: '2022-05-11T17:19:37.227Z' });
			isTokenExpired.mockReturnValue(false);
			await getEmailConfirmed(req, res);
			expect(getConfirmEmail).toBeCalledWith('12345');
			expect(isTokenExpired).toBeCalledWith(30, date);
			expect(req.session.confirmEmailId).toBeUndefined();
			expect(res.render).toBeCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/full-appeal/submit-appeal/list-of-documents'
			});
		});

		it('calls correct template: token expired', async () => {
			req.params.token = '12345';
			const date = new Date('2022-05-11T17:19:37.227Z');
			getConfirmEmail.mockReturnValue({
				createdAt: '2022-05-11T17:19:37.227Z',
				appealId: 'fake-123'
			});
			isTokenExpired.mockReturnValue(true);
			await getEmailConfirmed(req, res);
			expect(getConfirmEmail).toBeCalledWith('12345');
			expect(isTokenExpired).toBeCalledWith(30, date);
			expect(req.session.confirmEmailId).toEqual('fake-123');
			expect(res.render).not.toBeCalled();
			expect(res.redirect).toBeCalledWith(`/${LINK_EXPIRED}`);
		});
	});
});
