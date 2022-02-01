const {
  constants: { APPEAL_ID, APPLICATION_DECISION },
} = require('@pins/business-rules');
const taskListController = require('../../../../src/controllers/full-appeal/task-list');
const {
  VIEW: { TASK_LIST },
} = require('../../../../src/lib/full-appeal/views');
const {
  mockReq,
  mockRes,
  genericSections,
  deterministicSections,
  nonDeterministicSections,
} = require('../../full-appeal/mocks');

const mockAddress = {
  address: '11 Kingston Road, Bristol, BR12 7AU',
  appellant: 'Someone',
  number: '12345',
};

describe('controllers/full-appeal/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started - Deterministic Flow', () => {
      const req = mockReq();
      const res = mockRes();

      taskListController.getTaskList(req, res);
      const sections = [...genericSections];

      expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
        backLink: undefined,
        appeal: mockAddress,
        questionnaireStatus: 'incomplete',
        completedTasksCount: 0,
        totalTasksCount: 9,
        sections: [
          ...sections.slice(0, 5),
          ...deterministicSections,
          ...sections.slice(5, sections.length),
        ],
      });
    });

    it('All the tasks except check answers should be in not started - Non-Deterministic Flow', () => {
      const req = mockReq();
      const res = mockRes();

      req.session.appeal.eligibility.applicationDecision = APPLICATION_DECISION.NODECISIONRECEIVED;
      taskListController.getTaskList(req, res);
      const sections = [...genericSections];

      expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
        backLink: undefined,
        appeal: mockAddress,
        questionnaireStatus: 'incomplete',
        completedTasksCount: 0,
        totalTasksCount: 9,
        sections: [
          ...sections.slice(0, 5),
          ...nonDeterministicSections,
          ...sections.slice(5, sections.length),
        ],
      });
    });

    it('All the tasks except check answers should be in not started - Non-Deterministic Flow', () => {
      const req = mockReq();
      const res = mockRes();

      req.session.appeal.appealType = APPEAL_ID.HOUSEHOLDER;
      req.session.appeal.eligibility.applicationDecision = APPLICATION_DECISION.NODECISIONRECEIVED;
      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
        backLink: undefined,
        appeal: mockAddress,
        questionnaireStatus: 'incomplete',
        completedTasksCount: 0,
        totalTasksCount: 8,
        sections: genericSections,
      });
    });
  });
});
