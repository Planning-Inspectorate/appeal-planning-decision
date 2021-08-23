const { get } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const taskListController = require('../../../src/controllers/task-list');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');

describe('routes/task-list', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/task-list');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      `/:id/${VIEW.TASK_LIST}`,
      [fetchExistingAppealReplyMiddleware],
      taskListController.getTaskList
    );
  });
});
