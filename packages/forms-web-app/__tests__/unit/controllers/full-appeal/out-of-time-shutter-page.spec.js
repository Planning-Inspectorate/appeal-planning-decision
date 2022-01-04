const outOfTimeShutterPageController = require('../../../../src/controllers/full-appeal/out-of-time-shutter-page');
const { mockReq, mockRes } = require('../../mocks');
const {
  VIEW: { OUT_OF_TIME_SHUTTER_PAGE },
} = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/out-of-time-shutter-page', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getOutOfTimeShutterPage', () => {
    it('should render shutter page with valid appeal deadline', async () => {
      const appealDeadline = new Date();

      const mockRequest = {
        ...req,
        session: {
          appealDeadline,
        },
      };

      await outOfTimeShutterPageController.getOutOfTimeShutterPage(mockRequest, res);
      expect(res.render).toHaveBeenCalledWith(OUT_OF_TIME_SHUTTER_PAGE, { appealDeadline });
    });
  });
});
