const { setUserStatus } = require('../../../src/services/user.service');
const logger = require('../../../src/lib/logger');
const mongodb = require('../../../src/db/db');
const { STATUS_CONSTANTS } = require('../../../../constants');

jest.mock('../../../src/lib/logger', () => {
	return {
		info: jest.fn(),
		error: jest.fn()
	};
});

jest.mock('../../../src/db/db', () => {
	return {
		get: jest.fn().mockReturnValue({
			collection: jest.fn().mockReturnValue({
				findOneAndUpdate: jest.fn().mockReturnValue({
					_id: 1
				})
			})
		})
	};
});

describe('src/services/user.service', () => {
	it("should update a user's status", async () => {
		await setUserStatus(1, STATUS_CONSTANTS.ADDED);
		expect(logger.info).toHaveBeenNthCalledWith(1, 'attempting to set user status: 1');
		expect(logger.info).toHaveBeenNthCalledWith(2, 'set user status: 1');
	});
	it('should throw an error if it fails to update user', async () => {
		mongodb.get().collection().findOneAndUpdate.mockRejectedValue(new Error('Some mongo error'));
		try {
			await setUserStatus(1, STATUS_CONSTANTS.ADDED);
		} catch (e) {
			expect(logger.error).toHaveBeenCalled();
		}
	});
});
