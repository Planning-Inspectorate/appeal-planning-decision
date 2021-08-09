const magicLinkController = require('../../../src/controllers/magiclink');
const { mockReq, mockRes } = require('../mocks');

const redirectURL = '/5ff2de67-7dc1-4ff2-824c-43740c3a1c7a/task-list';

describe('controllers/magiclink', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    req.userData = {
      lpaCode: 'E69999999',
      redirectURL,
      email: 'test@test.com',
    };
  });

  describe('login', () => {
    it('should create a jwt cookie and redirect to the redirectURL', () => {
      magicLinkController.login(req, res);

      expect(res.cookie).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(redirectURL);
    });
  });
});
