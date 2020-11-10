const taskListController = require('../../../src/controllers/task-list');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/task-list', () => {
  describe('getTaskList', () => {
    it('should call the correct template', () => {
      taskListController.getTaskList(req, res);

      expect(res.render).toHaveBeenCalledWith('task-list/index');
    });
  });
});
