const {
	getEmailAddress,
	postEmailAddress
} = require('../../../../src/controllers/lpa-dashboard/email-address');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/lpa-user.service');

const res = mockRes();

const mockUser = {
	lpaCode: 'Q9999',
	email: 'test@example.com',
	lpaDomain: 'test.example.com'
};

const errors = {
	'add-user': 'Error message'
};
const errorSummary = [{ text: 'There was an error', href: '#' }];

describe('controllers/lpa-dashboard/email-address', () => {
	let req;

	beforeEach(() => {
		req = {
			...mockReq(null)
		};
		jest.resetAllMocks();
	});

	describe('getEmailAddress', () => {
		it('should render the view', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);

			await getEmailAddress(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.EMAIL_ADDRESS, {
				lpaDomain: `@${mockUser.lpaDomain}`
			});
		});
	});

	describe('postEmailAddress', () => {
		it('should redirect to confirm page', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			req.body = { 'add-user': 'test' };

			await postEmailAddress(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.CONFIRM_ADD_USER}`);
		});

		it('should store the new user email address in session', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			req.body = { 'add-user': 'test' };

			await postEmailAddress(req, res);

			expect(req.session.addUserEmailAddress).toBe(`test@${mockUser.lpaDomain}`);
		});

		it('should re-render the template with errors if submission validation fails', async () => {
			req = {
				...req,
				body: {
					['add-user']: '',
					errors,
					errorSummary
				}
			};

			getLPAUserFromSession.mockReturnValue(mockUser);

			await postEmailAddress(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.EMAIL_ADDRESS, {
				lpaDomain: `@${mockUser.lpaDomain}`,
				errorSummary,
				errors
			});
		});
	});
});
