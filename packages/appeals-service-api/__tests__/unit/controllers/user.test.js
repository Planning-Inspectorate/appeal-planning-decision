const { userSetStatus } = require('../../../src/controllers/user');
const { setUserStatus } = require('../../../src/services/user.service');
const logger = require('../../../src/lib/logger');
const { mockReq, mockRes } = require('../mocks');
const { STATUS_CONSTANTS } = require('../../../../constants');

const req = mockReq();
const res = mockRes();

jest.mock('../../../src/services/user.service', () => {
	return {
		setUserStatus: jest.fn()
	};
});

jest.mock('../../../src/lib/logger', () => {
	return {
		info: jest.fn(),
		error: jest.fn()
	};
});
describe('../../../src/controllers/user', () => {
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
