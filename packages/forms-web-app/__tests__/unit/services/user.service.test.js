const {
	createLPAUserSession,
	getUserFromSession,
	setLPAUserStatus,
	logoutUser
} = require('../../../src/services/user.service');
const { getLPA } = require('#lib/appeals-api-wrapper');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

jest.mock('#lib/appeals-api-wrapper', () => {
	return {
		getLPA: jest.fn()
	};
});

describe('services/user.service', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('createLPAUserSession', () => {
		it('should add user to session and combine with lpa details', async () => {
			const mockUser = { test: 'test' };
			const mockReq = {
				session: {}
			};
			const mockLPA = { domain: 'example.com', name: 'Test LPA' };
			const expectedResult = { ...mockUser, lpaName: mockLPA.name, lpaDomain: mockLPA.domain };

			getLPA.mockResolvedValue(mockLPA);

			await createLPAUserSession(mockReq, mockUser);

			expect(mockReq.session.user).toEqual(expectedResult);
		});
	});

	describe('getUserFromSession', () => {
		it('should return user from session ', async () => {
			const mockReq = {
				session: {
					lpaUser: { test: 'test' }
				}
			};

			const result = getUserFromSession(mockReq);

			expect(result).toEqual(mockReq.session.user);
		});
	});

	describe('setLPAUserStatus', () => {
		const req = {
			appealsApiClient: {
				setLPAUserStatus: jest.fn()
			}
		};
		it('should set the user status to confirmed', async () => {
			await setLPAUserStatus(req, 1, STATUS_CONSTANTS.CONFIRMED);
			expect(req.appealsApiClient.setLPAUserStatus).toHaveBeenCalledWith(
				1,
				STATUS_CONSTANTS.CONFIRMED
			);
		});
		it('should set the user status to added', async () => {
			await setLPAUserStatus(req, 1, STATUS_CONSTANTS.ADDED);
			expect(req.appealsApiClient.setLPAUserStatus).toHaveBeenCalledWith(1, STATUS_CONSTANTS.ADDED);
		});
		it('should not set the user status to unknownstatus', async () => {
			await setLPAUserStatus(req, 1, 'unknownstatus');
			expect(req.appealsApiClient.setLPAUserStatus).toHaveBeenCalledTimes(0);
		});
	});

	describe('logoutUser', () => {
		it('should remove user from session ', async () => {
			const mockReq = {
				session: {
					user: {},
					lastAccessedTime: new Date()
				}
			};

			logoutUser(mockReq);

			expect(mockReq.session.user).toEqual(null);
			expect(mockReq.session.lastAccessedTime).toEqual(null);
		});

		it('should not error if user not in session ', async () => {
			const mockReq = {
				session: {}
			};

			logoutUser(mockReq);

			expect(mockReq.session.user).toEqual(null);
			expect(mockReq.session.lastAccessedTime).toEqual(null);
		});
	});
});
