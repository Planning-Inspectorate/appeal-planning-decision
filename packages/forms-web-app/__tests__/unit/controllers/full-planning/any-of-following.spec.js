const anyOfFollowingController = require('../../../../src/controllers/full-planning/any-of-following');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/logger');

describe('controllers/full-planning/any-of-following', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getAnyOfFollowing', () => {
    it('should render any of following page', async () => {
      await anyOfFollowingController.getAnyOfFollowing(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_PLANNING.ANY_OF_FOLLOWING);
    });
  });

  describe('postAnyOfFollowing', () => {
    it('should re-render the template with errors if option is not selected', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: {
            option: {
              msg: 'Select if your appeal is about any of the following',
            },
          },
          errorSummary: [{ text: 'Select if your appeal is about any of the following' }],
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_PLANNING.ANY_OF_FOLLOWING, {
        errorSummary: [{ text: 'Select if your appeal is about any of the following' }],
        errors: {
          option: {
            msg: 'Select if your appeal is about any of the following',
          },
        },
      });
    });

    it('should send user to shutter page when choosing wrong single option', async () => {
      const mockRequest = {
        ...req,
        body: {
          option: 'a_listed_building',
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);
      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/use-a-different-service');
    });

    it('should send user to shutter page when choosing wrong multiple options', async () => {
      const mockRequest = {
        ...req,
        body: {
          option: ['a_listed_building', 'major_dwellings'],
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);
      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/use-a-different-service');
    });

    it('should send user to shutter page when sending invalid inputs', async () => {
      const mockRequest = {
        ...req,
        body: {
          option: [undefined, undefined],
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);
      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/use-a-different-service');
    });

    it('should send user to enforcement page when choosing none of these option', async () => {
      const mockRequest = {
        ...req,
        body: {
          option: 'none_of_these',
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);
      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/enforcement-notice');
    });
  });
});
