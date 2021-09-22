const grantedOrRefusedPlanningPermissionController = require('../../../../src/controllers/eligibility/granted-or-refused-permission');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/eligibility/granted-or-refused-permission', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getNoDecision', () => {
    it('should call the correct template', () => {
      grantedOrRefusedPlanningPermissionController.getNoDecision(req, res);
      expect(res.render).toHaveBeenCalledWith('eligibility/no-decision');
    });
  });

  describe('getGrantedOrRefusedPlanningPermission', () => {
    it('should call the correct template', () => {
      grantedOrRefusedPlanningPermissionController.getGrantedOrRefusedPermission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('getGrantedOrRefusedPlanningPermissionOut', () => {
    it('should call the permission out template', () => {
      grantedOrRefusedPlanningPermissionController.getGrantedOrRefusedPermissionOut(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT);
    });
  });

  describe('postGrantedOrRefusedPlanningPermission', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'granted-or-refused-permission': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await grantedOrRefusedPlanningPermissionController.postGrantedOrRefusedPermission(
        mockRequest,
        res
      );

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            planningPermissionStatus: null,
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

      const error = new Error('Api call error');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await grantedOrRefusedPlanningPermissionController.postGrantedOrRefusedPermission(
        mockRequest,
        res
      );

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it(`'should redirect to '/${VIEW.ELIGIBILITY.DECISION_DATE}' if 'planningPermissionStatus' is 'refused'`, async () => {
      const mockRequest = {
        ...req,
        body: {
          'granted-or-refused-permission': 'refused',
        },
      };
      await grantedOrRefusedPlanningPermissionController.postGrantedOrRefusedPermission(
        mockRequest,
        res
      );

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          planningPermissionStatus: 'refused',
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE}`);
    });

    it(`should redirect to '/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT}' if 'planningPermissionStatus' is 'granted'`, async () => {
      const planningPermissionStatusGranted = 'granted';
      const mockRequest = {
        ...req,
        body: { 'granted-or-refused-permission': planningPermissionStatusGranted },
      };
      await grantedOrRefusedPlanningPermissionController.postGrantedOrRefusedPermission(
        mockRequest,
        res
      );

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          planningPermissionStatus: planningPermissionStatusGranted,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT}`
      );
    });
  });
});
