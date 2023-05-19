const {
	getEmailConfirmed
} = require('../../../../src/controllers/appeal-householder-decision/email-address-confirmed');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { EMAIL_CONFIRMED }
	}
} = require('../../../../src/lib/views');

const { mockReq, mockRes } = require('../../mocks');

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
			await getEmailConfirmed(req, res);
			expect(res.render).toBeCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: 'list-of-documents'
			});
		});
	});
});
