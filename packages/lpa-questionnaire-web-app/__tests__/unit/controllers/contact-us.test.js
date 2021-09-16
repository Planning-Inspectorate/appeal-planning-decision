const contactUsController = require('../../../src/controllers/contact-us');
const appealReply = require('../emptyAppealReply');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/contact-us', () => {
  let res;
  let mockAppealReply;

  beforeEach(() => {
    res = mockRes();
    mockAppealReply = { ...appealReply };

    jest.resetAllMocks();
  });

  describe('render contact us page', () => {
    it('should render the contact us page', () => {
      mockAppealReply.aboutAppealSection.otherAppeals = {
        adjacentAppeals: false,
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      contactUsController.renderContactUs(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.CONTACT_US, {
        backLink: `/appeal-questionnaire/mock-id/task-list`,
      });
    });
  });
});
