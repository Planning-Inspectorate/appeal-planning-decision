const { VIEW } = require('../../../src/lib/views');
const {
  CANNOT_START_YET,
  IN_PROGRESS,
} = require('../../../src/services/task-status/task-statuses');

const { getNextTask, getTaskStatus } = require('../../../src/services/task.service');

describe('services/task.service', () => {
  describe('getNextTask', () => {
    it('should return task list as all the remaining section tasks cannot be started yet', async () => {
      const questionnaire = {
        sectionStates: {
          Section1: {
            Task1: IN_PROGRESS,
            Task2: CANNOT_START_YET,
            Task3: CANNOT_START_YET,
            Task4: CANNOT_START_YET,
          },
        },
      };

      const task = getNextTask(
        questionnaire,
        {
          sectionName: 'Section1',
          taskName: 'Task1',
        },
        questionnaire.sectionStates
      );

      expect(task.href).toEqual(`/${VIEW.TASK_LIST}`);
    });
  });
  describe('getTaskStatus', () => {
    it('should return null if task does not exist', () => {
      const questionnaire = {
        sectionStates: {
          Section1: {
            Task1: IN_PROGRESS,
            Task2: CANNOT_START_YET,
            Task3: CANNOT_START_YET,
            Task4: CANNOT_START_YET,
          },
        },
      };

      const status = getTaskStatus(questionnaire, 'Section2', 'Task1');

      expect(status).toBeNull();
    });
  });
});
