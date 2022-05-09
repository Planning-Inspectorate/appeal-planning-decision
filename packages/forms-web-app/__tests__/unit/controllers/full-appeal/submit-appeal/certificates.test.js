const {
  getCertificates,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/certificates');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/certificates', () => {
  const req = mockReq();
  const res = mockRes();

  describe('getCertificates', () => {
    it('calls correct template', async () => {
      await getCertificates(req, res);
      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.CERTIFICATES);
    });
  });
});
