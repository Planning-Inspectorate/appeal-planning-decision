const siteOwnershipController = require('../../../../src/controllers/appellant-submission/site-ownership');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

describe('controller/appellant-submission/site-ownership', () => {
  describe('getSiteOwnership', () => {
    it('should call the correct template', () => {
      siteOwnershipController.getSiteOwnership(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
        appeal: req.session.appeal,
      });
    });
  });
});
