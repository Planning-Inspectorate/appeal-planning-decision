const {
	createLPAUserSession,
	getLPAUserFromSession
} = require('../../../src/services/lpa-user.service');
const { getUserById } = require('../../../src/lib/appeals-api-wrapper');

jest.mock('../../../src/lib/appeals-api-wrapper');

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
});
