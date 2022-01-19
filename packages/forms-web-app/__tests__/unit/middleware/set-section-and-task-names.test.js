const setSectionAndTaskNames = require('../../../src/middleware/set-section-and-task-names');

describe('middleware/set-section-and-task-names', () => {
  const req = {};
  const res = jest.fn();
  const next = jest.fn();
  const sectionName = 'requiredDocumentsSection';
  const taskName = 'originalApplication';

  it('should set req.sectionName and req.taskName with the given values', () => {
    const middlewareFn = setSectionAndTaskNames(sectionName, taskName);
    middlewareFn(req, res, next);

    expect(req).toEqual({
      sectionName,
      taskName,
    });
  });
});
