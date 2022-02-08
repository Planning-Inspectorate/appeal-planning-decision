const {
  constants: { APPEAL_ID },
  models,
} = require('@pins/business-rules');
const {
  getIdentifyingTheOwners,
  postIdentifyingTheOwners,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/identifying-the-owners');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
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

  const sectionName = 'appealSiteSection';
  const taskName = 'siteOwnership';
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'identify-the-owners': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];
  const model = models.getModel(APPEAL_ID.PLANNING_SECTION_78);

  beforeEach(() => {
    appeal = {
      ...model,
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
        knowsTheOwners: 'some',
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      req = {
        ...req,
        body: {
          'identifying-the-owners': 'i-agree',
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
          'identifying-the-owners': 'i-agree',
        },
      };

      await postIdentifyingTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${ADVERTISING_YOUR_APPEAL}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
