const {
  NOT_STARTED,
  CANNOT_START_YET,
} = require('../../../src/services/task-status/task-statuses');
const { SECTIONS, getTaskStatus } = require('../../../src/services/task.service');
const appealReply = require('../emptyAppealReply');

describe('services/task.service', () => {
  describe('SECTIONS', () => {
    it('should return not started from statusTemp', () => {
      expect(SECTIONS[0].tasks[0].rule(appealReply)).toEqual(NOT_STARTED);
    });
    it('should return cannot start yet for statusCheckYourAnswer', () => {
      expect(SECTIONS[SECTIONS.length - 1].tasks[0].rule(appealReply)).toEqual(CANNOT_START_YET);
    });
  });
  describe('getTaskStatus', () => {
    it('should run the correct rule', () => {
      const mockRule = jest.fn(() => 'mock status');
      SECTIONS[0].tasks[0].rule = mockRule;

      const status = getTaskStatus(
        { id: 'mock-id' },
        SECTIONS[0].sectionId,
        SECTIONS[0].tasks[0].taskId
      );

      expect(mockRule).toHaveBeenCalledWith({ id: 'mock-id' });
      expect(status).toEqual('mock status');
    });
    it('should return null if a rule is not found', () => {
      const status = getTaskStatus({ id: 'mock-id' }, 'not-a-real-section', 'not-a-real-task');
      expect(status).toBeNull();
    });
  });
});
