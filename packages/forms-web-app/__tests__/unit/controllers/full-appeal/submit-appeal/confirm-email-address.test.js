const {
  getConfirmEmailAddress,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/confirm-email-address');

const {
  VIEW: {
    FULL_APPEAL: { CONFIRM_EMAIL_ADDRESS, EMAIL_ADDRESS },
  },
} = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/confirm-email-address', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getConfirmEmailAddress', () => {
    it('calls correct template', async () => {
      req.session.appeal.emailAddress = 'test@example.com';
      await getConfirmEmailAddress(req, res);
      expect(res.render).toBeCalledWith(CONFIRM_EMAIL_ADDRESS, {
        emailAddress: 'test@example.com',
        backLink: `/${EMAIL_ADDRESS}`,
      });
    });
  });
});
