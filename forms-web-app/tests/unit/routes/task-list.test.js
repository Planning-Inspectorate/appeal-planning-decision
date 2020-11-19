const { get } = require('./router-mock');
const taskListController = require('../../../src/controllers/task-list');

describe('routes/task-list', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/task-list');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/', taskListController.getTaskList);
  });
});
