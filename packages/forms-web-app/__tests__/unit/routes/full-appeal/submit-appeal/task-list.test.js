const { get } = require('../../router-mock');
const taskListController = require('../../../../../src/controllers/full-appeal/submit-appeal/task-list');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-appeal/submit-appeal/task-list', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/task-list');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/task-list',
      [fetchExistingAppealMiddleware],
      taskListController.getTaskList
    );
  });
});
