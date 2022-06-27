const {
  getEmailConfirmed, postEmailConfirmed,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/email-confirmed');

const {
  VIEW: {
    FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS },
  },
} = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/email-confirmed', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getEmailConfirmed', () => {
    it('calls correct template', async () => {
      await getEmailConfirmed(req, res);
      expect(res.render).toBeCalledWith(EMAIL_CONFIRMED, {});
    });
  });
});
