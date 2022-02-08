const anyOfFollowingController = require('../../../../src/controllers/full-appeal/any-of-following');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/appeals-api-wrapper');

const pageLinks = {
  previousPage: '/before-you-start/type-of-planning-application',
  nextPage: '/before-you-start/granted-or-refused',
  shutterPage: '/before-you-start/use-a-different-service',
};

describe('controllers/full-appeal/any-of-following', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();

    ({ empty: appeal } = APPEAL_DOCUMENT);
    createOrUpdateAppeal.mockResolvedValueOnce({ eligibility: {} });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render any of following page', async () => {
    await anyOfFollowingController.getAnyOfFollowing(req, res);
    expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.ANY_OF_FOLLOWING, {
      applicationCategory: appeal.eligibility.applicationCategories,
      backLink: pageLinks.previousPage,
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

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.ANY_OF_FOLLOWING, {
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
      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
    });
  });
});
