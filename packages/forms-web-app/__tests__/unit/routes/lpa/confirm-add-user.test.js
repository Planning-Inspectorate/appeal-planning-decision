const { get } = require('../router-mock');
const confirmAddUserController = require('../../../../src/controllers/lpa-dashboard/confirm-add-user');

jest.mock('../../../../src/controllers/lpa-dashboard/confirm-add-user');

describe('routes/lpa-dashboard/confirm-add-user', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/confirm-add-user');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/confirm-add-user',
			confirmAddUserController.getConfirmAddUser
		);
	});
});
