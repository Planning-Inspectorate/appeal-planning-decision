const {
    getSentAnotherLink,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/sent-another-link');

const {
  VIEW: {
    FULL_APPEAL: { SENT_ANOTHER_LINK: currentPage },
  },
} = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/sent-another-link', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getSentAnotherLink', () => {
    it('calls correct template', async () => {
      await getSentAnotherLink(req, res);
      expect(res.render).toBeCalledWith(currentPage, {});
    });
  });
});
