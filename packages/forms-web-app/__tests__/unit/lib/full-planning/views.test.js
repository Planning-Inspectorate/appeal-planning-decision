const { VIEW } = require('../../../../src/lib/full-planning/views');

describe('/lib/full-planning/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      FULL_APPEAL: {
        TASK_LIST: 'full-planning/full-appeal/task-list',
      },
    });
  });
});
