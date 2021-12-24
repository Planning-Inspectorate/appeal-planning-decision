const listedBuildingController = require('../../../../src/controllers/full-planning/listed-building');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/empty-appeal');
jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-planning/listed-building', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('Listed Building Tests', () => {
    it('should call the correct template on getListedBuilding', async () => {
      await listedBuildingController.getListedBuilding(req, res);

      expect(res.render).toBeCalledWith(VIEW.FULL_PLANNING.LISTED_BUILDING, {
        backLink: `/${VIEW.FULL_PLANNING.TYPE_OF_PLANNING_APPLICATION}`,
      });
    });

    it('should redirect to the use-a-different-service page', async () => {
      const mockRequest = {
        ...req,
        body: { 'listed-building': 'yes' },
      };

      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(appeal.eligibility.isListedBuilding).toEqual(true);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith({ ...appeal });

      expect(res.redirect).toBeCalledWith(`/${VIEW.FULL_PLANNING.USE_A_DIFFERENT_SERVICE}`);
    });

    it('should redirect to the enforecment-notice page', async () => {
      const mockRequest = {
        ...req,
        body: { 'listed-building': 'no' },
      };

      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(appeal.eligibility.isListedBuilding).toEqual(false);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
      });

      expect(res.redirect).toBeCalledWith(`/${VIEW.FULL_PLANNING.ENFORCEMENT_NOTICE}`); // Future Planning Application Decision Page
    });

    it('should render errors on the page', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: {
            'listed-building': {
              msg: 'Select yes if your appeal about a listed building',
            },
          },
        },
      };

      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.render).toBeCalledWith(`${VIEW.FULL_PLANNING.LISTED_BUILDING}`, {
        appeal,
        errors: {
          'listed-building': {
            msg: 'Select yes if your appeal about a listed building',
          },
        },
        errorSummary: [],
        backLink: `/${VIEW.FULL_PLANNING.TYPE_OF_PLANNING_APPLICATION}`,
      });
    });

    it('should render page with failed appeal update message', async () => {
      const error = new Error('API is down');

      const mockRequest = {
        ...req,
        body: { 'listed-building': 'outline-planning' },
      };

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(`${VIEW.FULL_PLANNING.LISTED_BUILDING}`, {
        appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: 'pageId' }],
        backLink: `/${VIEW.FULL_PLANNING.TYPE_OF_PLANNING_APPLICATION}`,
      });
    });
  });
});
