const {
	createLPAUserSession,
	getLPAUserFromSession,
	setLPAUserStatus
} = require('../../../src/services/lpa-user.service');
const { getLPA } = require('#lib/appeals-api-wrapper');
const { apiClient } = require('#lib/appeals-api-client');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

jest.mock('#lib/appeals-api-wrapper', () => {
	return {
		getLPA: jest.fn()
	};
});
jest.mock('#lib/appeals-api-client');

describe('services/lpa-user.service', () => {
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

			expect(mockReq.session.lpaUser).toEqual(expectedResult);
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
			await setLPAUserStatus(1, STATUS_CONSTANTS.CONFIRMED);
			expect(apiClient.setLPAUserStatus).toHaveBeenCalledWith(1, STATUS_CONSTANTS.CONFIRMED);
		});
		it('should set the user status to added', async () => {
			await setLPAUserStatus(1, STATUS_CONSTANTS.ADDED);
			expect(apiClient.setLPAUserStatus).toHaveBeenCalledWith(1, STATUS_CONSTANTS.ADDED);
		});
		it('should not set the user status to unknownstatus', async () => {
			await setLPAUserStatus(1, 'unknownstatus');
			expect(apiClient.setLPAUserStatus).toHaveBeenCalledTimes(0);
		});
	});
});
