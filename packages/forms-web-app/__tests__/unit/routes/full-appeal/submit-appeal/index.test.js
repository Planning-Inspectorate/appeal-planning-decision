const { use } = require('../../router-mock');
const taskListRouter = require('../../../../../src/routes/full-appeal/submit-appeal/task-list');
const checkAnswersRouter = require('../../../../../src/routes/full-appeal/submit-appeal/check-answers');
const contactDetailsRouter = require('../../../../../src/routes/full-appeal/submit-appeal/contact-details');
const applicationFormRouter = require('../../../../../src/routes/full-appeal/submit-appeal/application-form');

describe('routes/full-appeal/submit-appeal/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal');
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(4);
    expect(use).toHaveBeenCalledWith(taskListRouter);
    expect(use).toHaveBeenCalledWith(checkAnswersRouter);
    expect(use).toHaveBeenCalledWith(contactDetailsRouter);
    expect(use).toHaveBeenCalledWith(applicationFormRouter);
  });
});
