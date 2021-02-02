const areaAppealsController = require('../../../src/controllers/area-appeals');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/area-appeals', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getAreaAppeals', () => {
    it('should call the correct template', () => {
      areaAppealsController.getAreaAppeals(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.AREA_APPEALS);
    });
  });

  describe('postAreaAppeals', () => {
    it('should redirect with adjacent-appeals set to false', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'no',
        },
      };

      await areaAppealsController.postAreaAppeals(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.TASK_LIST}`);
    });

    it('should redirect with adjacent-appeals set to true and appeal-reference-numbers passed', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'yes',
          'appeal-reference-numbers': 'some-reference',
        },
      };

      await areaAppealsController.postAreaAppeals(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.TASK_LIST}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'yes',
          'appeal-reference-numbers': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await areaAppealsController.postAreaAppeals(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.AREA_APPEALS, {
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        values: {
          'adjacent-appeals': 'yes',
          'appeal-reference-numbers': null,
        },
      });
    });
  });
});
