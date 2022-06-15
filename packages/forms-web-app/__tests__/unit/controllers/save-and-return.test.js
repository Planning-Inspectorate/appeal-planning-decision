const { mockReq, mockRes } = require('../mocks');
const saveAndReturnController = require('../../../src/controllers/save-and-return');
const { saveAppeal } = require('../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../src/lib/submit-appeal/views');

jest.mock('../../../src/lib/appeals-api-wrapper');

describe('controllers/save-and-return', () => {
  let req;
  let res;

  beforeEach(() => {
    appeal = 'data';
    req = mockReq(appeal);
    res = mockRes();
    jest.resetAllMocks();
  });
  describe('postSaveAndReturn', () => {
    it('should redirect to the expected route if valid', async () => {
      await saveAndReturnController.postSaveAndReturn(req, res);
      expect(saveAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.SUBMIT_APPEAL.APPLICATION_SAVED}`);
    });
  });
});
