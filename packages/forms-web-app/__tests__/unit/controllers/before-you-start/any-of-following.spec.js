const anyOfFollowingController = require('../../../../src/controllers/before-you-start/any-of-following');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

describe('controllers/before-you-start/any-of-following', () => {
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
      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.ANY_OF_FOLLOWING, {});
    });
  });

  describe('postAnyOfFollowing', () => {
    it('should re-render the template with errors if option is not selected', async () => {
      const mockRequest = {
        ...req,
        body: {
          option: undefined,
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.ANY_OF_FOLLOWING, {
        errorSummary: [{ text: 'Select if your appeal is about any of the following', href: '#' }],
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
      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.SHUTTER, {});
    });

    it('should send user to shutter page when choosing wrong multiple options', async () => {
      const mockRequest = {
        ...req,
        body: {
          option: ['a_listed_building', 'major_dwellings'],
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.SHUTTER, {});
    });

    it('should send user to enforcement page when choosing none of these option', async () => {
      const mockRequest = {
        ...req,
        body: {
          option: 'none_of_these',
        },
      };

      await anyOfFollowingController.postAnyOfFollowing(mockRequest, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {});
    });
  });
});
