const {
  getInformationSubmitted,
  postInformationSubmitted,
} = require('../../../src/controllers/information-submitted');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { createPdf } = require('../../../src/services/pdf.service');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/lib/logger', () => ({
  child: () => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  }),
}));
jest.mock('../../../src/services/pdf.service');

describe('../../../src/controllers/information-submitted', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('getInformationSubmitted', () => {
    it('should call the correct template', () => {
      getInformationSubmitted(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.INFORMATION_SUBMITTED, {
        appealReplyId: null,
      });
    });
  });

  describe('postInformationSubmitted', () => {
    it('should return 500 if there is an error in the submission', async () => {
      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await postInformationSubmitted(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should redirect to information submitted page on success', async () => {
      createOrUpdateAppealReply.mockReturnValue('reply ok');
      createPdf.mockReturnValue({ id: 'mock-pdf', name: 'mock.pdf' });

      await postInformationSubmitted(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.INFORMATION_SUBMITTED}`);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
