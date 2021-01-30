const taskListController = require('../../../src/controllers/task-list');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/services/task.service', () => ({
  __esModule: true,
  SECTIONS: [
    {
      sectionId: 'mockSection',
      tasks: [
        {
          taskId: 'mockTask1',
          href: '/mock-task-1',
          rule: () => 'NOT STARTED',
        },
        {
          taskId: 'mockTask2',
          href: '/mock-task-2',
          rule: () => 'NOT STARTED',
        },
      ],
    },
  ],
  HEADERS: {
    mockSection: 'Mock Section',
    mockTask1: 'Mock Task 1',
    mockTask2: 'Mock Task 2',
  },
}));

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
              text: 'Mock Section',
            },
            tasks: [
              {
                href: '/mock-task-1',
                text: 'Mock Task 1',
                status: 'NOT STARTED',
                attributes: {
                  'mockTask1-status': 'NOT STARTED',
                  name: 'mockTask1',
                },
              },
              {
                href: '/mock-task-2',
                text: 'Mock Task 2',
                status: 'NOT STARTED',
                attributes: {
                  'mockTask2-status': 'NOT STARTED',
                  name: 'mockTask2',
                },
              },
            ],
          },
        ],
      });
    });
  });
});
