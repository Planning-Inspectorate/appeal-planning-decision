const {
  getCertificates,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/certificates');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/certificates', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getCertificates', () => {
    it('calls correct template', async () => {
      await getCertificates(req, res);
      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.CERTIFICATES);
    });
  });
});
