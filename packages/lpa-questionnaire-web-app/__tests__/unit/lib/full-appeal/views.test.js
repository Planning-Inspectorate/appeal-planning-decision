const { VIEW } = require('../../../../src/lib/full-appeal/views');

describe('lib/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      TASK_LIST: 'full-appeal/task-list',
      PROCEDURE_TYPE: 'full-appeal/procedure-type',
    });
  });
});
