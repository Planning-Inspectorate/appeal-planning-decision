const { use } = require('../../router-mock');
const taskListRouter = require('../../../../../src/routes/full-planning/full-appeal/task-list');
const checkAnswersRouter = require('../../../../../src/routes/full-planning/full-appeal/check-answers');
const applicationFormRouter = require('../../../../../src/routes/full-planning/full-appeal/application-form');

describe('routes/full-planning/full-appeal/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-planning/full-appeal');
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(3);
    expect(use).toHaveBeenCalledWith(taskListRouter);
    expect(use).toHaveBeenCalledWith(checkAnswersRouter);
    expect(use).toHaveBeenCalledWith(applicationFormRouter);
  });
});
