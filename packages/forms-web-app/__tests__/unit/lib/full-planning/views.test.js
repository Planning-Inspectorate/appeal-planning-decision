const { VIEW } = require('../../../../src/lib/full-planning/views');

describe('/lib/full-planning/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      FULL_APPEAL: {
        CHECK_ANSWERS: 'full-planning/full-appeal/check-answers',
        TASK_LIST: 'full-planning/full-appeal/task-list',
      },
    });
  });
});
