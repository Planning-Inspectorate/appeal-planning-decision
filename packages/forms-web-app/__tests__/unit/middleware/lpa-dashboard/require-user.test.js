const requireUser = require('../../../../src/middleware/lpa-dashboard/require-user');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');
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

	it('calls next if enabled user is in session', () => {
		req.session.lpaUser = {
			enabled: true
		};

		requireUser(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('returns a 401 if no user', () => {
		requireUser(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
		expect(next).not.toHaveBeenCalled();
	});

	it('returns a 401 user status is removed', () => {
		const userEnabledStates = [STATUS_CONSTANTS.REMOVED];

		userEnabledStates.forEach((state) => {
			req.session.lpaUser = {
				status: state
			};

			requireUser(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
			expect(next).not.toHaveBeenCalled();
		});
	});
});
