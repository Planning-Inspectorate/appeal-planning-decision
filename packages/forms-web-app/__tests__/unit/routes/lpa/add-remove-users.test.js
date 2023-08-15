const { get } = require('../router-mock');
const addRemoveUsersController = require('../../../../src/controllers/lpa-dashboard/add-remove-users');

jest.mock('../../../../src/controllers/lpa-dashboard/add-remove-users');

describe('routes/lpa-dashboard/add-remove-users', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/add-remove-users');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/add-remove-users',
			addRemoveUsersController.getAddRemoveUsers
		);
	});
});
