const v8 = require('v8');
const appeal = require('../../../../mockData/householder-appeal');
const appealFP = require('../../../../mockData/full-appeal');

const {
  getConditionsHouseholderPermission,
  postConditionsHouseholderPermission,
} = require('../../../../../src/controllers/householder-planning/eligibility/conditions-householder-permission');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { CONDITIONS_HOUSEHOLDER_PERMISSION },
    },
  },
} = require('../../../../../src/lib/householder-planning/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/householder-planning/eligibility/conditions-householder-permission', () => {
  let req;
  let res;

  const sectionName = 'eligibility';
  const errors = { 'conditions-householder-permission': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {},
      })
    );
    res = mockRes();
    jest.resetAllMocks();
  });

  describe('getConditionsHouseholderPermission', () => {
    it('should call the correct template', () => {
      getConditionsHouseholderPermission(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(CONDITIONS_HOUSEHOLDER_PERMISSION, {
        hasHouseholderPermissionConditions: true,
      });
    });
  });

  describe('postConditionsHouseholderPermission', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'conditions-householder-permission': null,
          errors,
          errorSummary,
        },
      };

      await postConditionsHouseholderPermission(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(CONDITIONS_HOUSEHOLDER_PERMISSION, {
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      req = {
        ...req,
        body: {
          'conditions-householder-permission': 'yes',
        },
      };

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postConditionsHouseholderPermission(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(CONDITIONS_HOUSEHOLDER_PERMISSION, {
        hasHouseholderPermissionConditions: true,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      const appealFPDeepCopy = JSON.parse(JSON.stringify(appealFP));
      appealFPDeepCopy[sectionName].hasHouseholderPermissionConditions = true;
      appealFPDeepCopy.appealType = '1001';

      const submittedAppeal = {
        ...appealFPDeepCopy,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'conditions-householder-permission': 'yes',
        },
      };

      await postConditionsHouseholderPermission(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building-householder');
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      appealFP[sectionName].hasHouseholderPermissionConditions = false;
      appealFP.appealType = '1005';

      const submittedAppeal = {
        ...appealFP,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'conditions-householder-permission': 'no',
        },
      };

      await postConditionsHouseholderPermission(req, res);

      // expect(createOrUpdateAppeal).toHaveBeenCalledWith(tempAppeal);
      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/any-of-following');
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
