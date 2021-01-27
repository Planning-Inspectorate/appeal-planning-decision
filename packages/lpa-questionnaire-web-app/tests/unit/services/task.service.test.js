const {
  NOT_STARTED,
  CANNOT_START_YET,
} = require('../../../src/services/task-status/task-statuses');
const { SECTIONS } = require('../../../src/services/task.service');

describe('services/task.service', () => {
  describe('SECTIONS', () => {
    it('should return not started from statusTemp', () => {
      expect(SECTIONS[0].tasks[0].rule()).toEqual(NOT_STARTED);
    });
    it('should return cannot start yet for statusCheckYourAnswer', () => {
      expect(SECTIONS[SECTIONS.length - 1].tasks[0].rule()).toEqual(CANNOT_START_YET);
    });
  });
});
