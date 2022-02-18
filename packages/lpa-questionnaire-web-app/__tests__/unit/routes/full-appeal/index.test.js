const { use } = require('../router-mock');

const taskListRouter = require('../../../../src/routes/full-appeal/task-list');

describe('routes/full-appeal/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/full-appeal');
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(taskListRouter);
  });
});
