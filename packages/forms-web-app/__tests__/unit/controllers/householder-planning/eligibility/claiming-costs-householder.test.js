const claimingCostsController = require('../../../../../src/controllers/householder-planning/eligibility/claiming-costs-householder');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');

const { VIEW } = require('../../../../../src/lib/householder-planning/views');
const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/empty-appeal');
jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');

describe('controllers/householder-planning/claiming-costs-householder', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('Claiming Costs Tests', () => {
    it('should call the correct template on getClaimingCostsHouseholder', async () => {
      await claimingCostsController.getClaimingCostsHouseholder(req, res);

      expect(res.render).toBeCalledWith(VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.CLAIMING_COSTS, {
        backLink: `/${VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.ENFORCEMENT_NOTICE}`,
      });
    });

    it('should redirect to the use-a-different-service page', async () => {
      const mockRequest = {
        ...req,
        body: { 'claiming-costs-householder': 'yes' },
      };

      await claimingCostsController.postClaimingCostsHouseholder(mockRequest, res);

      expect(appeal.eligibility.isClaimingCosts).toEqual(true);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith({ ...appeal });

      expect(res.redirect).toBeCalledWith(`/before-you-start/use-a-different-service`);
    });

    it('should redirect to the results-householder page', async () => {
      const mockRequest = {
        ...req,
        body: { 'claiming-costs-householder': 'no' },
      };

      await claimingCostsController.postClaimingCostsHouseholder(mockRequest, res);

      expect(appeal.eligibility.isClaimingCosts).toEqual(false);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
      });

      expect(res.redirect).toBeCalledWith(
        `/${VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.HAS_APPEAL_FORM}`
      ); // Future Planning Application Decision Page
    });

    it('should render errors on the page', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: {
            'claiming-costs-householder': {
              msg: 'Select yes if you are claiming costs as part of your appeal',
            },
          },
        },
      };

      await claimingCostsController.postClaimingCostsHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.render).toBeCalledWith(`${VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.CLAIMING_COSTS}`, {
        appeal,
        errors: {
          'claiming-costs-householder': {
            msg: 'Select yes if you are claiming costs as part of your appeal',
          },
        },
        errorSummary: [],
        backLink: `/${VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.ENFORCEMENT_NOTICE}`,
      });
    });

    it('should render page with failed appeal update message', async () => {
      const error = new Error('API is down');

      const mockRequest = {
        ...req,
        body: { 'claiming-costs-householder': 'outline-planning' },
      };

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await claimingCostsController.postClaimingCostsHouseholder(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(
        `${VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.CLAIMING_COSTS}`,
        {
          appeal,
          errors: {},
          errorSummary: [{ text: error.toString(), href: 'pageId' }],
          backLink: `/${VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.ENFORCEMENT_NOTICE}`,
        }
      );
    });
  });
});
