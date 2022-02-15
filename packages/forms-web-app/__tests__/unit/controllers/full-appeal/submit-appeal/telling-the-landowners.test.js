const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { STANDARD_TRIPLE_CONFIRM_OPTIONS } = require('@pins/business-rules/src/constants');
const {
  getTellingTheLandowners,
  postTellingTheLandowners,
  validTellingTheLandownerOptions,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/telling-the-landowners');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { AGRICULTURAL_HOLDING, TELLING_THE_LANDOWNERS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/telling-the-landowners', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'appealSiteSection';
  const taskName = 'tellingTheLandowners';
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'telling-the-landowners': `Confirm if you've told the landowners` };
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

  describe('getTellingTheLandowners', () => {
    it('should call the correct template', () => {
      getTellingTheLandowners(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(TELLING_THE_LANDOWNERS, {
        ownsSomeOfTheLand: false,
        tellingTheLandowners: STANDARD_TRIPLE_CONFIRM_OPTIONS,
      });
    });
  });

  describe('postTellingTheLandowners', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'telling-the-landowners': undefined,
          errors,
          errorSummary,
        },
      };
      req.session.appeal.appealSiteSection.ownsSomeOfTheLand = true;

      await postTellingTheLandowners(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(TELLING_THE_LANDOWNERS, {
        ownsSomeOfTheLand: false,
        tellingTheLandowners: [],
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      req = {
        ...req,
        body: {
          'telling-the-landowners': [validTellingTheLandownerOptions[0]],
        },
      };

      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postTellingTheLandowners(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(TELLING_THE_LANDOWNERS, {
        ownsSomeOfTheLand: false,
        tellingTheLandowners: [validTellingTheLandownerOptions[0]],
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
          'telling-the-landowners': [validTellingTheLandownerOptions[0]],
        },
      };

      await postTellingTheLandowners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${AGRICULTURAL_HOLDING}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
