const { get, post } = require('../router-mock');
const confirmAddUserController = require('../../../../src/controllers/lpa-dashboard/confirm-remove-user');

jest.mock('../../../../src/controllers/lpa-dashboard/confirm-remove-user');

describe('routes/lpa-dashboard/confirm-remove-user', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/confirm-remove-user');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/confirm-remove-user/:id',
			confirmAddUserController.getConfirmRemoveUser
		);
		expect(post).toHaveBeenCalledWith(
			'/confirm-remove-user/:id',
			confirmAddUserController.postConfirmRemoveUser
		);
	});
});
