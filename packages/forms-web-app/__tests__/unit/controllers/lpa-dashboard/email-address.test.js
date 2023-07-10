const {
	getEmailAddress,
	postEmailAddress
} = require('../../../../src/controllers/lpa-dashboard/email-address');
const { getLPA } = require('../../../../src/lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/lpa-user.service');

const req = {
	...mockReq(null)
};
const res = mockRes();

const mockUser = {
	lpaCode: 'Q9999',
	email: 'test@example.com'
};

const mockLpa = {
	domain: 'test.example.com'
};

describe('controllers/lpa-dashboard/email-address', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getEmailAddress', () => {
		it('should render the view', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getLPA.mockResolvedValue(mockLpa);

			await getEmailAddress(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(getLPA).toHaveBeenCalledWith(mockUser.lpaCode);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.EMAIL_ADDRESS, {
				lpaDomain: `@${mockLpa.domain}`
			});
		});

		it('should store the new user domain in the session', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getLPA.mockResolvedValue(mockLpa);
			req.session.addUserLpaDomain = null;

			await getEmailAddress(req, res);

			expect(req.session.addUserLpaDomain).toEqual(mockLpa.domain);
		});
	});

	describe('postEmailAddress', () => {
		it('should redirect to confirm page', async () => {
			req.body = { 'add-user': 'test' };

			await postEmailAddress(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.CONFIRM_ADD_USER}`);
		});

		it('should store the new user email address in session and remove new user domain from session', async () => {
			req.session.addUserLpaDomain = mockLpa.domain;
			req.body = { 'add-user': 'test' };

			await postEmailAddress(req, res);

			expect(req.session.addUserLpaDomain).toBe(undefined);
			expect(req.session.addUserEmailAddress).toBe(`test@${mockLpa.domain}`);
		});
	});
});
