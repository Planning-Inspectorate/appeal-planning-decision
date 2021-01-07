const { VIEW } = require('../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../src/lib/empty-appeal');

const { SECTIONS, getNextUncompletedTask } = require('../../../src/services/task.service');

describe('services/task.service', () => {
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

  describe('getNextUncompletedTask', () => {
    [
      {
        appeal: {
          sectionStates: {
            Section1: {
              Task1: 'CANNOT_START_YET',
            },
          },
        },
        currentTask: {
          sectionName: 'Section1',
          taskName: 'Task1',
        },
        expected: { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` },
      },
      {
        appeal: {
          sectionStates: {
            Section1: {
              Task1: 'CANNOT_START_YET',
              Task2: 'CANNOT_START_YET',
            },
          },
        },
        currentTask: {
          sectionName: 'Section1',
          taskName: 'Task2',
        },
        expected: { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` },
      },
      {
        appeal: {
          sectionStates: {
            Section1: {
              Task1: 'IN PROGRESS',
              Task2: 'COMPLETED',
              Task3: 'COMPLETED',
              Task4: 'COMPLETED',
            },
          },
        },
        currentTask: {
          sectionName: 'Section1',
          taskName: 'Task1',
        },
        expected: { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` },
      },
      {
        appeal: {
          sectionStates: {
            Section1: {
              Task1: 'IN PROGRESS',
              Task2: 'IN PROGRESS',
              Task3: 'IN PROGRESS',
              Task4: 'IN PROGRESS',
            },
          },
        },
        currentTask: {
          sectionName: 'Section1',
          taskName: 'Task1',
        },
        expected: { href: undefined, status: 'IN PROGRESS', taskName: 'Task2' },
      },
    ].forEach(({ appeal, currentTask, expected }) => {
      it('should return the expected next uncompleted task', () => {
        expect(getNextUncompletedTask(appeal, currentTask, appeal.sectionStates)).toEqual(expected);
      });
    });

    it('should fall through to default even when allowing `sections` to be an optional parameter', () => {
      const appeal = {};
      const currentTask = {
        sectionName: 'aboutYouSection',
        taskName: 'yourDetails',
      };
      expect(getNextUncompletedTask(appeal, currentTask)).toEqual({
        href: '/appellant-submission/task-list',
      });
    });

    it('should allow `sections` to be an optional parameter', () => {
      const appeal = {
        ...APPEAL_DOCUMENT.empty,
        sectionStates: {
          aboutYouSection: {
            yourDetails: 'IN PROGRESS',
          },
          requiredDocumentsSection: {
            applicationNumber: 'NOT STARTED',
            originalApplication: 'NOT STARTED',
            decisionLetter: 'NOT STARTED',
          },
        },
      };
      const currentTask = {
        sectionName: 'requiredDocumentsSection',
        taskName: 'applicationNumber',
      };
      expect(getNextUncompletedTask(appeal, currentTask)).toEqual({
        href: '/appellant-submission/upload-application',
        status: 'NOT STARTED',
        taskName: 'originalApplication',
      });
    });
  });
});
