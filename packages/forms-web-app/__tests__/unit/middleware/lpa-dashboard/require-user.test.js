const requireUser = require('../../../../src/middleware/lpa-dashboard/require-user');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('#lib/views');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

describe('requireUser', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for lpa user
		req = {
			...mockReq(null),
			session: {}
		};
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
	});

	it('calls next if user is in session', () => {
		req.session.user = {
			isLpaUser: true
		};

		requireUser(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('returns a 401 if no user', () => {
		requireUser(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
		expect(next).not.toHaveBeenCalled();
	});

	it('returns a 401 user status is removed', () => {
		const userEnabledStates = [STATUS_CONSTANTS.REMOVED];

		userEnabledStates.forEach((state) => {
			req.session.user = {
				lpaStatus: state
			};

			requireUser(req, res, next);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
			expect(next).not.toHaveBeenCalled();
		});
	});
});
