const {
	createLPAUserSession,
	getLPAUserFromSession,
	setLPAUserStatus
} = require('../../../src/services/lpa-user.service');
const { getUserById, setUserStatus } = require('../../../src/lib/appeals-api-wrapper');

jest.mock('../../../src/lib/appeals-api-wrapper', () => {
	return {
		getUserById: jest.fn(),
		setUserStatus: jest.fn()
	};
});

describe('services/lpa-user.service', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('createLPAUserSession', () => {
		it('should add user to session ', async () => {
			const mockUser = { test: 'test' };
			const mockReq = {
				session: {}
			};
			const mockId = 'a';

			getUserById.mockResolvedValue(mockUser);

			await createLPAUserSession(mockReq, mockId);

			expect(getUserById).toHaveBeenCalledWith(mockId);
			expect(mockReq.session.lpaUser).toEqual(mockUser);
		});
	});

	describe('getLPAUserFromSession', () => {
		it('should return user from session ', async () => {
			const mockReq = {
				session: {
					lpaUser: { test: 'test' }
				}
			};

			const result = getLPAUserFromSession(mockReq);

			expect(result).toEqual(mockReq.session.lpaUser);
		});
	});

	describe('setLPAUserStatus', () => {
		it('should set the user status to confirmed', async () => {
			await setLPAUserStatus(1, 'confirmed');
			expect(setUserStatus).toHaveBeenCalledWith(1, 'confirmed');
		});
		it('should set the user status to added', async () => {
			await setLPAUserStatus(1, 'added');
			expect(setUserStatus).toHaveBeenCalledWith(1, 'added');
		});
		it('should not set the user status to unknownstatus', async () => {
			await setLPAUserStatus(1, 'unknownstatus');
			expect(setUserStatus).toHaveBeenCalledTimes(0);
		});
	});
});
