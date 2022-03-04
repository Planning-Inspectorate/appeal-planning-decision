const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { STANDARD_TRIPLE_CONFIRM_OPTIONS } = require('@pins/business-rules/src/constants');
const {
  getTellingTheTenants,
  postTellingTheTenants,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/telling-the-tenants');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { VISIBLE_FROM_ROAD, TELLING_THE_TENANTS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/telling-the-tenants', () => {
  let req;
  let res;
  let appeal;

  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'telling-the-tenants': `Confirm if you've told the tenants` };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...fullAppeal,
      id: appealId,
    };
    req = {
      ...mockReq(),
      body: {},
      session: {
        appeal,
      },
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getTellingTheTenants', () => {
    it('should call the correct template', () => {
      getTellingTheTenants(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(TELLING_THE_TENANTS, {
        tellingTheTenants: STANDARD_TRIPLE_CONFIRM_OPTIONS,
        isOther: true,
        backLink: '/full-appeal/submit-appeal/other-tenants',
      });
    });

    it('should set correct backLink if agriculturalHolding.isTenant is false', () => {
      req.session.appeal.appealSiteSection.agriculturalHolding.isTenant = false;
      getTellingTheTenants(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(TELLING_THE_TENANTS, {
        tellingTheTenants: STANDARD_TRIPLE_CONFIRM_OPTIONS,
        isOther: false,
        backLink: '/full-appeal/submit-appeal/are-you-a-tenant',
      });
    });
  });

  describe('postTellingTheTenants', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'telling-the-tenants': undefined,
          errors,
          errorSummary,
        },
      };
      req.session.appeal.appealSiteSection.agriculturalHolding.isTenant = true;

      await postTellingTheTenants(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(TELLING_THE_TENANTS, {
        tellingTheTenants: [],
        errors,
        errorSummary,
        isOther: true,
        backLink: '/full-appeal/submit-appeal/other-tenants',
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      req = {
        ...req,
        body: {
          'telling-the-tenants': [STANDARD_TRIPLE_CONFIRM_OPTIONS[0]],
        },
      };

      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postTellingTheTenants(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(TELLING_THE_TENANTS, {
        tellingTheTenants: [STANDARD_TRIPLE_CONFIRM_OPTIONS[0]],
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
        isOther: true,
        backLink: '/full-appeal/submit-appeal/other-tenants',
      });
    });

    it('should redirect to the correct page user confirms the page', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'telling-the-tenants': [STANDARD_TRIPLE_CONFIRM_OPTIONS[0]],
        },
      };

      await postTellingTheTenants(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${VISIBLE_FROM_ROAD}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
