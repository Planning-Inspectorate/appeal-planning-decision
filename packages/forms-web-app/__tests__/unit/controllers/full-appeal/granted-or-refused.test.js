const grantedOrRefusedPlanningApplicationController = require('../../../../src/controllers/full-appeal/granted-or-refused');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/granted-or-refused', () => {
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

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.GRANTED_OR_REFUSED, {
        appeal: req.session.appeal,
        previousPage: '/before-you-start/any-of-following',
      });
    });
  });

  describe('forwardPage', () => {
    it(`should return '/${VIEW.FULL_APPEAL.DECISION_DATE}' if passed 'permissionStatus' is 'granted'`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage('granted');

      expect(pageRedirect).toEqual('/before-you-start/decision-date');
    });

    it(`should return '/${VIEW.FULL_APPEAL.DECISION_DATE}' if passed 'permissionStatus' is 'refused'`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage('refused');

      expect(pageRedirect).toEqual('/before-you-start/decision-date');
    });

    it(`should return '/${VIEW.FULL_APPEAL.DATE_DECISION_DUE}' if passed 'permissionStatus' is 'nodecisionreceived'`, async () => {
      const pageRedirect =
        grantedOrRefusedPlanningApplicationController.forwardPage('nodecisionreceived');

      expect(pageRedirect).toEqual('/before-you-start/date-decision-due');
    });

    it(`should return '/${VIEW.FULL_APPEAL.ANY_OF_FOLLOWING}' if passed 'permissionStatus' is 'previousPage'`, async () => {
      const pageRedirect =
        grantedOrRefusedPlanningApplicationController.forwardPage('previousPage');

      expect(pageRedirect).toEqual('/before-you-start/any-of-following');
    });

    it(`should return '/${VIEW.FULL_APPEAL.GRANTED_OR_REFUSED}' if passed 'permissionStatus' is 'default'`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage('default');

      expect(pageRedirect).toEqual(VIEW.FULL_APPEAL.GRANTED_OR_REFUSED);
    });

    it(`should return '/${VIEW.FULL_APPEAL.GRANTED_OR_REFUSED}' if 'permissionStatus' is not passed`, async () => {
      const pageRedirect = grantedOrRefusedPlanningApplicationController.forwardPage();

      expect(pageRedirect).toEqual(VIEW.FULL_APPEAL.GRANTED_OR_REFUSED);
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

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.GRANTED_OR_REFUSED, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            applicationDecision: null,
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        previousPage: '/before-you-start/any-of-following',
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

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.GRANTED_OR_REFUSED, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
        previousPage: '/before-you-start/any-of-following',
      });
    });

    it(`'should redirect to '/${VIEW.FULL_APPEAL.DECISION_DATE}' if 'applicationDecision' is 'refused'`, async () => {
      const applicationDecision = 'refused';
      const mockRequest = {
        ...req,
        body: {
          'granted-or-refused': applicationDecision,
        },
      };
      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
    });

    it(`should redirect to '/${VIEW.FULL_APPEAL.DECISION_DATE}' if 'applicationDecision' is 'granted'`, async () => {
      const applicationDecision = 'granted';
      const mockRequest = {
        ...req,
        body: { 'granted-or-refused': applicationDecision },
      };
      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
    });

    it(`should redirect to '/${VIEW.FULL_APPEAL.DATE_DECISION_DUE}' if 'applicationDecision' is 'nodecisionreceived'`, async () => {
      const applicationDecision = 'nodecisionreceived';
      const mockRequest = {
        ...req,
        body: { 'granted-or-refused': applicationDecision },
      };
      await grantedOrRefusedPlanningApplicationController.postGrantedOrRefused(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/date-decision-due');
    });
  });
});
