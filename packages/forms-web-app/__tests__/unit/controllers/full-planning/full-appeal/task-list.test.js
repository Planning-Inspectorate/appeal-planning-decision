const taskListController = require('../../../../../src/controllers/full-planning/full-appeal/task-list');
const { VIEW } = require('../../../../../src/lib/full-planning/views');
const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-planning/full-appeal/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started', () => {
      const req = mockReq();
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sectionInfo: {
          nbTasks: 5,
          nbCompleted: 0,
        },
        sections: [
          {
            href: `/full-appeal/contact-details`,
            text: 'Provide your contact details',
            status: 'NOT STARTED',
            attributes: {
              'contactDetailsSection-status': 'NOT STARTED',
              name: 'contactDetailsSection',
            },
          },
          {
            href: `/`,
            text: 'Tell us about the appeal site',
            status: 'NOT STARTED',
            attributes: {
              'aboutAppealSiteSection-status': 'NOT STARTED',
              name: 'aboutAppealSiteSection',
            },
          },
          {
            href: `/`,
            text: 'Upload documents from your planning application',
            status: 'NOT STARTED',
            attributes: {
              'planningApplicationDocumentsSection-status': 'NOT STARTED',
              name: 'planningApplicationDocumentsSection',
            },
          },
          {
            href: `/`,
            text: 'Upload documents for your appeal',
            status: 'NOT STARTED',
            attributes: {
              'appealDocumentsSection-status': 'NOT STARTED',
              name: 'appealDocumentsSection',
            },
          },
          {
            href: '/full-appeal/check-answers',
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
