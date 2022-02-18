const appeal = require('@pins/business-rules/test/data/full-appeal');
const taskListController = require('../../../../../src/controllers/full-appeal/submit-appeal/task-list');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');

describe.skip('controllers/full-appeal/submit-appeal/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started', () => {
      const req = mockReq(appeal);
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.TASK_LIST, {
        applicationStatus: 'Appeal incomplete',
        sectionInfo: {
          nbTasks: 5,
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
              'aboutAppealSiteSection-status': 'NOT STARTED',
              name: 'aboutAppealSiteSection',
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
            href: `/${VIEW.FULL_APPEAL.CHECK_ANSWERS}`,
            text: 'Check your answers and submit your appeal',
            status: 'NOT STARTED',
            attributes: {
              'submitYourAppealSection-status': 'NOT STARTED',
              name: 'submitYourAppealSection',
            },
          },
        ],
      });
    });
  });
});
