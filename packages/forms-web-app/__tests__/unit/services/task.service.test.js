const { VIEW } = require('../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../src/lib/empty-appeal');
const {
  CANNOT_START_YET,
  COMPLETED,
  IN_PROGRESS,
  NOT_STARTED,
} = require('../../../src/services/task-status/task-statuses');

const { SECTIONS, getNextTask } = require('../../../src/services/task.service');

describe('services/task.service', () => {
  describe('getNextTask', () => {
    it('should return next on going task', async () => {
      const appeal = {
        sectionStates: {
          Section1: {
            Task1: IN_PROGRESS,
            Task2: CANNOT_START_YET,
            Task3: COMPLETED,
            Task4: IN_PROGRESS,
          },
        },
      };

      const task = getNextTask(
        appeal,
        {
          sectionName: 'Section1',
          taskName: 'Task1',
        },
        appeal.sectionStates
      );

      expect(task.taskName).toEqual('Task3');
    });
    it('should return task list as all the remaining section tasks cannot be started yet', async () => {
      const appeal = {
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
        appeal,
        {
          sectionName: 'Section1',
          taskName: 'Task1',
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
      ).toEqual(COMPLETED);
    });
  });

  describe('getNextTask', () => {
    [
      {
        appeal: {
          sectionStates: {
            Section1: {
              Task1: CANNOT_START_YET,
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
              Task1: CANNOT_START_YET,
              Task2: CANNOT_START_YET,
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
              Task1: IN_PROGRESS,
              Task2: CANNOT_START_YET,
              Task3: CANNOT_START_YET,
              Task4: CANNOT_START_YET,
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
              Task1: IN_PROGRESS,
              Task2: IN_PROGRESS,
              Task3: IN_PROGRESS,
              Task4: IN_PROGRESS,
            },
          },
        },
        currentTask: {
          sectionName: 'Section1',
          taskName: 'Task1',
        },
        expected: { href: undefined, status: IN_PROGRESS, taskName: 'Task2' },
      },
    ].forEach(({ appeal, currentTask, expected }) => {
      it('should return the expected next on going task', () => {
        expect(getNextTask(appeal, currentTask, appeal.sectionStates)).toEqual(expected);
      });
    });

    it('should fall through to default even when allowing `sections` to be an optional parameter', () => {
      const appeal = {};
      const currentTask = {
        sectionName: 'aboutYouSection',
        taskName: 'yourDetails',
      };
      expect(getNextTask(appeal, currentTask)).toEqual({
        href: '/appellant-submission/task-list',
      });
    });

    it('should allow `sections` to be an optional parameter', () => {
      const appeal = {
        ...APPEAL_DOCUMENT.empty,
        sectionStates: {
          aboutYouSection: {
            yourDetails: IN_PROGRESS,
          },
          requiredDocumentsSection: {
            applicationNumber: NOT_STARTED,
            originalApplication: NOT_STARTED,
            decisionLetter: NOT_STARTED,
          },
        },
      };
      const currentTask = {
        sectionName: 'requiredDocumentsSection',
        taskName: 'applicationNumber',
      };
      expect(getNextTask(appeal, currentTask)).toEqual({
        href: '/appellant-submission/upload-application',
        status: NOT_STARTED,
        taskName: 'originalApplication',
      });
    });
  });
});
