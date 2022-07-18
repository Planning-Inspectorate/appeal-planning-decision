const { get } = require('../router-mock');
const taskListController = require('../../../../src/controllers/appeal-householder-decision/task-list');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

describe('routes/task-list', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/task-list');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/task-list',
			[fetchExistingAppealMiddleware],
			taskListController.getTaskList
		);
	});
});
