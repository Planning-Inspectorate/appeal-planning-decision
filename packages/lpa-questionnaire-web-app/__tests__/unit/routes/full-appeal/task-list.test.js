const { get } = require('../router-mock');
const {
  VIEW: { TASK_LIST },
} = require('../../../../src/lib/full-appeal/views');
const taskListController = require('../../../../src/controllers/full-appeal/task-list');

describe('routes/full-appeal/task-list', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal/task-list');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(`/${TASK_LIST}`, taskListController.getTaskList);
  });
});
