const householderPlanningPermissionController = require('../../../../src/controllers/eligibility/householder-planning-permission');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/eligibility/householder-planning-permission', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getServiceOnlyForHouseholderPlanningPermission', () => {
    it('calls the correct template', () => {
      householderPlanningPermissionController.getServiceOnlyForHouseholderPlanningPermission(
        req,
        res
      );

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION_OUT);
    });
  });

  describe('getHouseholderPlanningPermission', () => {
    it('should call the correct template', () => {
      householderPlanningPermissionController.getHouseholderPlanningPermission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postHouseholderPlanningPermission', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'householder-planning-permission': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await householderPlanningPermissionController.postHouseholderPlanningPermission(
        mockRequest,
        res
      );

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            householderPlanningPermission: null,
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

      await householderPlanningPermissionController.postHouseholderPlanningPermission(
        mockRequest,
        res
      );

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it(`'should redirect to '/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION}' if 'householder-planning-permission' is 'yes'`, async () => {
      const mockRequest = {
        ...req,
        body: {
          'householder-planning-permission': 'yes',
        },
      };
      await householderPlanningPermissionController.postHouseholderPlanningPermission(
        mockRequest,
        res
      );

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          householderPlanningPermission: true,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION}`);
    });

    it(`'should redirect to '/${VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION_OUT}' if 'householder-planning-permission' is 'no'`, async () => {
      const mockRequest = {
        ...req,
        body: {
          'householder-planning-permission': 'no',
        },
      };
      await householderPlanningPermissionController.postHouseholderPlanningPermission(
        mockRequest,
        res
      );

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          householderPlanningPermission: false,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION_OUT}`
      );
    });
  });
});
