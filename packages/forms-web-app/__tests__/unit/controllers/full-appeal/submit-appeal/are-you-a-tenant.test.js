const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getAreYouATenant,
  postAreYouATenant,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/are-you-a-tenant');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { ARE_YOU_A_TENANT, OTHER_TENANTS, TELLING_THE_TENANTS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/are-you-a-tenant', () => {
  let req;
  let res;

  const sectionName = 'appealSiteSection';
  const taskName = 'agriculturalHolding';
  const errors = { 'are-you-a-tenant': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];
  appeal.sectionStates.appealSiteSection.areYouATenant = 'COMPLETED';

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

  describe('getAreYouATenant', () => {
    it('should call the correct template', () => {
      getAreYouATenant(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ARE_YOU_A_TENANT, {
        isTenant: true,
      });
    });
  });

  describe('postAreYouATenant', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'are-you-a-tenant': undefined,
          errors,
          errorSummary,
        },
      };

      await postAreYouATenant(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ARE_YOU_A_TENANT, {
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postAreYouATenant(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ARE_YOU_A_TENANT, {
        isTenant: false,
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

      req = {
        ...req,
        body: {
          'are-you-a-tenant': 'yes',
        },
      };

      await postAreYouATenant(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${OTHER_TENANTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].isTenant = false;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'are-you-a-tenant': 'no',
        },
      };

      await postAreYouATenant(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_TENANTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
