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
    req = mockReq();
    res = mockRes();
    jest.resetAllMocks();
  });
  describe('postSaveAndReturn', () => {
    it('should redirect to the expected route if valid', async () => {
      req = {
        ...req,
        session: {
          appeal: appeal,
          navigationHistory: ['nav/p1', 'nav/p2'],
        },
      };
      await saveAndReturnController.postSaveAndReturn(req, res);
      expect(saveAppeal).toHaveBeenCalledWith(appeal);
      expect(req.session.navigationHistory).toHaveLength(1);
      expect(req.session.navigationHistory).toEqual(['nav/p2']);
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.SUBMIT_APPEAL.APPLICATION_SAVED}`);
    });
  });
});
