const {
  getEnterCode,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/enter-code');
const { sendToken } = require('../../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../../src/lib/submit-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/enter-code', () => {
  let req;
  let res;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.resetAllMocks();
  });
  describe('getEnterCode', () => {
    it('should render enter code page when receiving the token from email', async () => {
      sendToken.mockReturnValue();
      await getEnterCode(req, res);
      expect(res.render).toBeCalledWith(`${VIEW.SUBMIT_APPEAL.ENTER_CODE}`);
    });
  });
});
