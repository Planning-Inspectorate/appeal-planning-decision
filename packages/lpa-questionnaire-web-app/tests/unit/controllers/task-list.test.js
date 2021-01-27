const taskListController = require('../../../src/controllers/task-list');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/task-list', () => {
  describe('getTaskList', () => {
    it('All the tasks except check answers should be in not started', () => {
      const req = mockReq();
      const res = mockRes();

      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.TASK_LIST, {
        applicationStatus: 'Application incomplete',
        sections: [
          {
            heading: {
              text: 'About the appeal',
            },
            tasks: [
              {
                href: `#`,
                text: "Review accuracy of the appellant's submission",
                status: 'NOT STARTED',
                attributes: {
                  'submissionAccuracy-status': 'NOT STARTED',
                  name: 'submissionAccuracy',
                },
              },
            ],
          },
        ],
      });
    });
  });
});
