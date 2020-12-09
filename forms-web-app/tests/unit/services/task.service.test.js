const { VIEW } = require('../../../src/lib/views');

const { getNextUncompletedTask } = require('../../../src/services/task.service');

describe('services/task', () => {
  describe('getNextTask', () => {
    it('should return next uncompleted task', async () => {
      const sectionStates = {
        Section1: {
          Task1: 'IN PROGRESS',
          Task2: 'COMPLETED',
          Task3: 'COMPLETED',
          Task4: 'IN PROGRESS',
        },
      };

      const task = getNextUncompletedTask(
        sectionStates,
        {
          sectionName: 'Section1',
          taskName: 'Task2',
        },
        sectionStates
      );

      expect(task.taskName).toEqual('Task4');
    });
    it('should return task list as all the section tasks are completed', async () => {
      const sectionStates = {
        Section1: {
          Task1: 'IN PROGRESS',
          Task2: 'COMPLETED',
          Task3: 'COMPLETED',
          Task4: 'COMPLETED',
        },
      };

      const task = getNextUncompletedTask(
        sectionStates,
        {
          sectionName: 'Section1',
          taskName: 'Task2',
        },
        sectionStates
      );

      expect(task.href).toEqual(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });
  });
});
