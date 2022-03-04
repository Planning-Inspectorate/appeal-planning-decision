const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { I_AGREE } = require('@pins/business-rules/src/constants');
const {
  getIdentifyingTheOwners,
  postIdentifyingTheOwners,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/identifying-the-owners');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { ADVERTISING_YOUR_APPEAL, IDENTIFYING_THE_OWNERS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/identifying-the-owners', () => {
  let req;
  let res;
  let appeal;

  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'identify-the-owners': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...fullAppeal,
      id: appealId,
      appealSiteSection: {
        siteOwnership: {
          knowsTheOwners: 'some',
          identifyingTheOwners: undefined,
        },
      },
    };
    req = {
      ...mockReq(appeal),
      body: {},
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getIdentifyingTheOwners', () => {
    it('should call the correct template', () => {
      getIdentifyingTheOwners(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(IDENTIFYING_THE_OWNERS, {
        knowsTheOwners: 'some',
        backLink: '/full-appeal/submit-appeal/know-the-owners',
      });
    });
  });

  describe('postIdentifyingTheOwners', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'identifying-the-owners': undefined,
          errors,
          errorSummary,
        },
      };
      req.session.appeal.appealSiteSection.knowsTheOwners = 'some';

      await postIdentifyingTheOwners(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(IDENTIFYING_THE_OWNERS, {
        hasIdentifiedTheOwners: false,
        knowsTheOwners: 'some',
        backLink: '/full-appeal/submit-appeal/know-the-owners',
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      req = {
        ...req,
        body: {
          'identifying-the-owners': I_AGREE,
        },
      };

      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postIdentifyingTheOwners(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(IDENTIFYING_THE_OWNERS, {
        knowsTheOwners: 'some',
        backLink: '/full-appeal/submit-appeal/know-the-owners',
        hasIdentifiedTheOwners: true,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
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
          'identifying-the-owners': I_AGREE,
        },
      };

      await postIdentifyingTheOwners(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${ADVERTISING_YOUR_APPEAL}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
