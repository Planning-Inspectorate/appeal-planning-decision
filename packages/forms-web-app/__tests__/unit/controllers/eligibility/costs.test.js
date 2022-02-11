const appeal = require('@pins/business-rules/test/data/householder-appeal');
const costsController = require('../../../../src/controllers/eligibility/costs');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

describe('controllers/appellant-submission/claim-costs', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getCosts', () => {
    it('should call the correct template', () => {
      costsController.getCosts(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.COSTS, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('getCostsOut', () => {
    it('should call the correct template', () => {
      costsController.getCostsOut(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.COSTS_OUT);
    });
  });

  describe('postCosts', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'claim-costs': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await costsController.postCosts(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.COSTS, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            isClaimingCosts: false,
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      const error = new Error('Cheers');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await costsController.postCosts(mockRequest, res);

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.COSTS, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it(`should redirect to /${VIEW.ELIGIBILITY.APPEAL_STATEMENT} if does not claiming costs`, async () => {
      const mockRequest = {
        ...req,
        body: {
          'claim-costs': 'no',
        },
      };

      await costsController.postCosts(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          isClaimingCosts: false,
        },
      });

      expect(logger.error).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.APPEAL_STATEMENT}`);
    });

    it(`should redirect to /${VIEW.ELIGIBILITY.COSTS_OUT} if claiming costs`, async () => {
      const mockRequest = {
        ...req,
        body: {
          'claim-costs': 'yes',
        },
      };

      await costsController.postCosts(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          isClaimingCosts: true,
        },
      });

      expect(logger.error).not.toHaveBeenCalled();

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.COSTS_OUT}`);
    });
  });
});
