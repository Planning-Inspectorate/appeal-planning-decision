const { VIEW } = require('../../../src/lib/views');

const { getNextUncompletedTask, SECTIONS } = require('../../../src/services/task.service');

describe('services/task', () => {
  describe('getNextTask', () => {
    it('should return next uncompleted task', async () => {
      const appeal = {
        sectionStates: {
          Section1: {
            Task1: 'IN PROGRESS',
            Task2: 'CANNOT START YET',
            Task3: 'COMPLETED',
            Task4: 'IN PROGRESS',
          },
        },
      };

      const task = getNextUncompletedTask(
        appeal,
        {
          sectionName: 'Section1',
          taskName: 'Task2',
        },
        appeal.sectionStates
      );

      expect(task.taskName).toEqual('Task4');
    });
    it('should return task list as all the section tasks are completed', async () => {
      const appeal = {
        sectionStates: {
          Section1: {
            Task1: 'IN PROGRESS',
            Task2: 'COMPLETED',
            Task3: 'COMPLETED',
            Task4: 'COMPLETED',
          },
        },
      };

      const task = getNextUncompletedTask(
        appeal,
        {
          sectionName: 'Section1',
          taskName: 'Task2',
        },
        appeal.sectionStates
      );

      expect(task.href).toEqual(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });
  });
  describe('SECTIONS', () => {
    it('should return early from statusCheckYourAnswer if the appeal is already submitted ', () => {
      expect(
        SECTIONS.submitYourAppealSection.checkYourAnswers.rule({ state: 'SUBMITTED' })
      ).toEqual('COMPLETED');
    });
  });
});
