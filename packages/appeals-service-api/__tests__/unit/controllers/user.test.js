const { userSetStatus, userPost } = require('../../../src/controllers/user');
const {
	setUserStatus,
	addLPAUserNotify,
	createUser
} = require('../../../src/services/user.service');
const logger = require('../../../src/lib/logger');
const { mockReq, mockRes } = require('../mocks');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

const req = mockReq();
const res = mockRes();

jest.mock('../../../src/services/user.service', () => {
	return {
		setUserStatus: jest.fn(),
		addLPAUserNotify: jest.fn(),
		createUser: jest.fn()
	};
});

jest.mock('../../../src/lib/logger', () => {
	return {
		info: jest.fn(),
		error: jest.fn()
	};
});
describe('../../../src/controllers/user', () => {

	beforeEach(async () => {
		jest.clearAllMocks();
	});

	describe('userSetStatus', () => {
		it("should update a user's status", async () => {
			req.params.id = 1;
			req.body.status = STATUS_CONSTANTS.ADDED;
			await userSetStatus(req, res);
			expect(setUserStatus).toHaveBeenCalledWith(1, STATUS_CONSTANTS.ADDED);
			expect(res.status).toHaveBeenCalledWith(200);
		});
		it("should log an error if it fails to update a user's status", async () => {
			req.params.id = 1;
			req.body.status = STATUS_CONSTANTS.ADDED;
			setUserStatus.mockRejectedValue(new Error('Some mongo error'));
			await userSetStatus(req, res);
			expect(setUserStatus).toHaveBeenCalledWith(1, STATUS_CONSTANTS.ADDED);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(logger.error).toHaveBeenCalledWith(
				'Failed to update user status: 500 // Some mongo error'
			);
		});
	});

	describe('userPost', () => {
		it('should call notify service with a user if user created successfully', async () => {
			const mockUser = {
				email: 'test@example.com',
				isAdmin: false,
				enabled: true,
				lpaCode: 'Q9999'
			};

			req.body = mockUser;
			await userPost(req, res);

			expect(addLPAUserNotify).toHaveBeenCalledWith(mockUser);
		});

		it('should not call notify service if user not created successfully', async () => {

			createUser.mockRejectedValue(new Error('API Error'));

			await userPost(req, res);

			expect(addLPAUserNotify).not.toHaveBeenCalled();
		});
	});
});
