const { get } = require('../router-mock');
const taskListController = require('../../../../src/controllers/full-planning/full-appeal/task-list');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-planning/full-appeal/task-list', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-planning/full-appeal/task-list');
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
