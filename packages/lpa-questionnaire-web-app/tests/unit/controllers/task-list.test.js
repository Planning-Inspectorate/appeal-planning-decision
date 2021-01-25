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
        sectionInfo: {
          nbTasks: 1,
          nbCompleted: 0,
          sections: {
            count: 1,
            completed: 0,
          },
        },
        sections: [
          {
            heading: {
              text: 'About the appeal',
            },
            items: [
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
