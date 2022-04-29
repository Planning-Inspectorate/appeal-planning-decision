const appeal = require('@pins/business-rules/test/data/householder-appeal');
const listedBuildingController = require('../../../../../src/controllers/householder-planning/eligibility/listed-building-householder');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const { VIEW } = require('../../../../../src/lib/householder-planning/views');

const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');

describe('controllers/householder-planning/eligibility/listed-building-householder', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('Listed Building Tests', () => {
    it('should call the correct template on getListedBuildingHouseholder', async () => {
      await listedBuildingController.getListedBuildingHouseholder(req, res);

      expect(res.render).toBeCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.LISTED_BUILDING_HOUSEHOLDER,
        {
          isListedBuilding: appeal.eligibility.isListedBuilding,
          typeOfPlanningApplication: 'householder-planning',
        }
      );
    });

    it('should redirect to the use-existing-service-listed-building page', async () => {
      const mockRequest = {
        ...req,
        body: { 'listed-building-householder': 'yes' },
      };

      await listedBuildingController.postListedBuildingHouseholder(mockRequest, res);

      expect(appeal.eligibility.isListedBuilding).toEqual(true);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith({ ...appeal });

      expect(res.redirect).toBeCalledWith('/before-you-start/use-existing-service-listed-building');
    });

    it('should redirect to the granted-or-refused-householder page', async () => {
      const mockRequest = {
        ...req,
        body: { 'listed-building-householder': 'no' },
      };

      await listedBuildingController.postListedBuildingHouseholder(mockRequest, res);

      expect(appeal.eligibility.isListedBuilding).toEqual(false);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
      });

      expect(res.redirect).toBeCalledWith('/before-you-start/granted-or-refused-householder');
    });

    it('should render errors on the page', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: {
            'listed-building-householder': {
              msg: 'Select yes if your appeal about a listed building',
            },
          },
        },
      };

      await listedBuildingController.postListedBuildingHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.render).toBeCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.LISTED_BUILDING_HOUSEHOLDER,
        {
          isListedBuilding: appeal.eligibility.isListedBuilding,
          typeOfPlanningApplication: 'householder-planning',
          errors: {
            'listed-building-householder': {
              msg: 'Select yes if your appeal about a listed building',
            },
          },
          errorSummary: [],
        }
      );
    });

    it('should render page with failed appeal update message', async () => {
      const error = new Error('API is down');

      const mockRequest = {
        ...req,
        body: { 'listed-building-householder': 'outline-planning' },
      };

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await listedBuildingController.postListedBuildingHouseholder(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.LISTED_BUILDING_HOUSEHOLDER,
        {
          isListedBuilding: appeal.eligibility.isListedBuilding,
          typeOfPlanningApplication: 'householder-planning',
          errors: {},
          errorSummary: [{ text: error.toString(), href: '#' }],
        }
      );
    });
  });
});
