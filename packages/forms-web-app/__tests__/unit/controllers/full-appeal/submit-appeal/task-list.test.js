const appeal = require('@pins/business-rules/test/data/full-appeal');
const taskListController = require('../../../../../src/controllers/full-appeal/submit-appeal/task-list');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started', () => {
      const req = mockReq({
        ...appeal,
        state: undefined,
      });
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.TASK_LIST, {
        applicationStatus: 'Appeal incomplete',
        sectionInfo: {
          nbTasks: 6,
          nbCompleted: 0,
        },
        sections: [
          {
            href: `/${VIEW.FULL_APPEAL.ORIGINAL_APPLICANT}`,
            text: 'Provide your contact details',
            status: 'NOT STARTED',
            attributes: {
              'contactDetailsSection-status': 'NOT STARTED',
              name: 'contactDetailsSection',
            },
          },
          {
            href: '/full-appeal/submit-appeal/appeal-site-address',
            text: 'Tell us about the appeal site',
            status: 'NOT STARTED',
            attributes: {
              'appealSiteSection-status': 'NOT STARTED',
              name: 'appealSiteSection',
            },
          },
          {
            href: '/full-appeal/submit-appeal/how-decide-appeal',
            text: 'Tell us how you would prefer us to decide your appeal',
            status: 'NOT STARTED',
            attributes: {
              'appealDecisionSection-status': 'NOT STARTED',
              name: 'appealDecisionSection',
            },
          },
          {
            href: `/${VIEW.FULL_APPEAL.APPLICATION_FORM}`,
            text: 'Upload documents from your planning application',
            status: 'NOT STARTED',
            attributes: {
              'planningApplicationDocumentsSection-status': 'NOT STARTED',
              name: 'planningApplicationDocumentsSection',
            },
          },
          {
            href: `/${VIEW.FULL_APPEAL.APPEAL_STATEMENT}`,
            text: 'Upload documents for your appeal',
            status: 'NOT STARTED',
            attributes: {
              'appealDocumentsSection-status': 'NOT STARTED',
              name: 'appealDocumentsSection',
            },
          },
          {
            href: `/${VIEW.FULL_APPEAL.CHECK_YOUR_ANSWERS}`,
            text: 'Check your answers and submit your appeal',
            status: 'CANNOT START YET',
            attributes: {
              'submitYourAppealSection-status': 'CANNOT START YET',
              name: 'submitYourAppealSection',
            },
          },
        ],
      });
    });
  });
});
