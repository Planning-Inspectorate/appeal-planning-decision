const fetch = require('node-fetch');
const {
  getInformationSubmitted,
  postInformationSubmitted,
} = require('../../../src/controllers/information-submitted');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { createPdf } = require('../../../src/services/pdf.service');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');
const mockAppeal = require('../mockAppeal');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/lib/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
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
  let lpaEmail;
  let lpaEmailString;
  let mockLPAObject;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    req.session.appeal = mockAppeal;

    fetch.resetMocks();
    fetch.doMock();

    lpaEmail = 'mock-lpa-name@planninginspectorate.gov.uk';
    lpaEmailString = `We’ve sent a confirmation email to ${lpaEmail}.`;

    mockLPAObject = {
      id: mockAppeal.lpaCode,
      name: 'System Test Borough Council',
      inTrial: true,
      email: lpaEmail,
      domain: 'planninginspectorate.gov.uk',
      england: true,
      wales: false,
      horizonId: null,
    };
  });

  describe('getInformationSubmitted', () => {
    it('should call the correct template, with the correct email address in place', async () => {
      fetch.mockResponseOnce(JSON.stringify(mockLPAObject));
      await getInformationSubmitted(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.INFORMATION_SUBMITTED, {
        lpaEmailString,
      });
    });

    it('should error on failed get email attempt', async () => {
      lpaEmailString = '';
      fetch.mockRejectOnce(JSON.stringify({ errors: ['Get LPA Email failed'] }), {
        status: 400,
      });
      await getInformationSubmitted(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.INFORMATION_SUBMITTED, {
        lpaEmailString,
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
