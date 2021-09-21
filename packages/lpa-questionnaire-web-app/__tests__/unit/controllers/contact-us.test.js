const contactUsController = require('../../../src/controllers/contact-us');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/contact-us', () => {
  let res;

  beforeEach(() => {
    res = mockRes();
    jest.resetAllMocks();
  });

  describe('render contact us page', () => {
    it('should render the contact us page', () => {
      const mockRequest = {
        ...mockReq(),
      };

      contactUsController.renderContactUs(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.CONTACT_US, {
        backLink: `/appeal-questionnaire/mock-id/task-list`,
      });
    });

    it('should render contact us page with the correct backlink set', () => {
      const mockRequest = {
        ...mockReq(),
      };

      mockRequest.session.backLink = '/appeal-questionnaire/mock-id/mock-back-link';
      contactUsController.renderContactUs(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.CONTACT_US, {
        backLink: `/appeal-questionnaire/mock-id/mock-back-link`,
      });
    });
  });
});
