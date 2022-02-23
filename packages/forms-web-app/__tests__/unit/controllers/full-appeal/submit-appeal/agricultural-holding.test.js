const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getAgriculturalHolding,
  postAgriculturalHolding,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/agricultural-holding');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { AGRICULTURAL_HOLDING, ARE_YOU_A_TENANT, VISIBLE_FROM_ROAD },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/agricultural-holding', () => {
  let req;
  let res;

  const sectionName = 'appealSiteSection';
  const taskName = 'agriculturalHolding';
  const errors = { 'agricultural-holding': 'Select an option' };
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

  describe('getAgriculturalHolding', () => {
    it('should call the correct template', () => {
      getAgriculturalHolding(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(AGRICULTURAL_HOLDING, {
        isAgriculturalHolding: true,
        ownsAllTheLand: true,
        knowsTheOwners: 'yes',
      });
    });
  });

  describe('postAgriculturalHolding', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'agricultural-holding': undefined,
          errors,
          errorSummary,
        },
      };

      await postAgriculturalHolding(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(AGRICULTURAL_HOLDING, {
        ownsAllTheLand: true,
        knowsTheOwners: 'yes',
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postAgriculturalHolding(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(AGRICULTURAL_HOLDING, {
        isAgriculturalHolding: false,
        ownsAllTheLand: true,
        knowsTheOwners: 'yes',
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

      req = {
        ...req,
        body: {
          'agricultural-holding': 'yes',
        },
      };

      await postAgriculturalHolding(req, res);

      // expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${ARE_YOU_A_TENANT}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].isAgriculturalHolding = false;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

      req = {
        ...req,
        body: {
          'agricultural-holding': 'no',
        },
      };

      await postAgriculturalHolding(req, res);

      // expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${VISIBLE_FROM_ROAD}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
