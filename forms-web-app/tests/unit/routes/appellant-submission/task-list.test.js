const { get } = require('../router-mock');
const taskListController = require('../../../../src/controllers/appellant-submission/task-list');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

describe('routes/task-list', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/task-list');
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
