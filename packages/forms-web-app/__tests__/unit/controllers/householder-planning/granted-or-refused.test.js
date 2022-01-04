const grantedOrRefusedPlanningApplicationController = require('../../../../src/controllers/householder-planning/eligibility/granted-or-refused');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { GRANTED_OR_REFUSED: currentPage },
    },
  },
} = require('../../../../src/lib/householder-planning/views');

const forwardPage = {
  nextPageDateDecision: '/before-you-start/decision-date-householder',
  nextPageDateDecisionDue: '/before-you-start/date-decision-due-householder',
  previousPage: '/before-you-start/listed-building-householder',
};
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/householder-planning/eligibility/granted-or-refused', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getGrantedOrRefusedPlanningApplication', () => {
    it('should call the correct template', () => {
      grantedOrRefusedPlanningApplicationController.getGrantedOrRefused(req, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: req.session.appeal,
        previousPage: forwardPage.previousPage,
      });
    });
  });

  describe('forwardPage', () => {
    it(`should return '${forwardPage.nextPageDateDecision}' if passed 'permissionStatus' is 'granted'`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage('granted');

      expect(pageRedirect).toEqual(forwardPage.nextPageDateDecision);
    });

    it(`should return '/${forwardPage.nextPageDateDecision}' if passed 'permissionStatus' is 'refused'`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage('refused');

      expect(pageRedirect).toEqual(forwardPage.nextPageDateDecision);
    });

    it(`should return '/${forwardPage.nextPageDateDecisionDue}' if passed 'permissionStatus' is 'nodecisionreceived'`, async () => {
      const pageRedirect =
        grantedOrRefusedPlanningApplicationController.forwardPage('nodecisionreceived');

      expect(pageRedirect).toEqual(forwardPage.nextPageDateDecisionDue);
    });

    it(`should return '/${forwardPage.previousPage}' if passed 'permissionStatus' is 'previousPage'`, async () => {
      const pageRedirect =
        grantedOrRefusedPlanningApplicationController.forwardPage('previousPage');

      expect(pageRedirect).toEqual(forwardPage.previousPage);
    });

    it(`should return '/${currentPage}' if passed 'permissionStatus' is 'default'`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage('default');

      expect(pageRedirect).toEqual(currentPage);
    });

    it(`should return '/${currentPage}' if 'permissionStatus' is not passed`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage();

      expect(pageRedirect).toEqual(currentPage);
    });
  });

  describe('postGrantedOrRefusedPlanning', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'granted-or-refused': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            applicationDecision: null,
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        previousPage: forwardPage.previousPage,
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      const error = new Error('Api call error');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
        previousPage: forwardPage.previousPage,
      });
    });

    it(`'should redirect to '/${forwardPage.nextPageDateDecision}' if 'applicationDecision' is 'refused'`, async () => {
      const applicationDecision = 'refused';
      const mockRequest = {
        ...req,
        body: {
          'granted-or-refused': applicationDecision,
        },
      };
      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          applicationDecision,
        },
        previousPage: forwardPage.previousPage,
      });

      expect(res.redirect).toHaveBeenCalledWith(forwardPage.nextPageDateDecision);
    });

    it(`should redirect to '/${forwardPage.nextPageDateDecision}' if 'applicationDecision' is 'granted'`, async () => {
      const applicationDecision = 'granted';
      const mockRequest = {
        ...req,
        body: { 'granted-or-refused': applicationDecision },
      };
      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          applicationDecision,
        },
        previousPage: forwardPage.previousPage,
      });

      expect(res.redirect).toHaveBeenCalledWith(forwardPage.nextPageDateDecision);
    });

    it(`should redirect to '/${forwardPage.nextPageDateDecisionDue}' if 'applicationDecision' is 'nodecisionreceived'`, async () => {
      const applicationDecision = 'nodecisionreceived';
      const mockRequest = {
        ...req,
        body: { 'granted-or-refused': applicationDecision },
      };
      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          applicationDecision,
        },
        previousPage: forwardPage.previousPage,
      });

      expect(res.redirect).toHaveBeenCalledWith(forwardPage.nextPageDateDecisionDue);
    });
  });
});
