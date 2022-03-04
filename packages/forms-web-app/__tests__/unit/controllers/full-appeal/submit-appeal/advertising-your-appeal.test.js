const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { STANDARD_TRIPLE_CONFIRM_OPTIONS } = require('@pins/business-rules/src/constants');
const {
  getAdvertisingYourAppeal,
  postAdvertisingYourAppeal,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/advertising-your-appeal');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { ADVERTISING_YOUR_APPEAL, TELLING_THE_LANDOWNERS, AGRICULTURAL_HOLDING },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/advertising-your-appeal', () => {
  let req;
  let res;
  let appeal;

  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'advertising-your-appeal': `Confirm if you have advertised your appeal` };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...JSON.parse(JSON.stringify(fullAppeal)),
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

  describe('getAdvertisingYourAppeal', () => {
    it('should call the correct template', () => {
      getAdvertisingYourAppeal(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ADVERTISING_YOUR_APPEAL, {
        advertisingYourAppeal: STANDARD_TRIPLE_CONFIRM_OPTIONS,
        isOther: false,
        isAll: false,
        backLink: '/full-appeal/submit-appeal/identifying-the-owners',
      });
    });

    it('should render isOther=true if ownsSomeOfTheLand is true', () => {
      req.session.appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand = true;
      getAdvertisingYourAppeal(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ADVERTISING_YOUR_APPEAL, {
        advertisingYourAppeal: STANDARD_TRIPLE_CONFIRM_OPTIONS,
        isOther: true,
        isAll: false,
        backLink: '/full-appeal/submit-appeal/identifying-the-owners',
      });
    });

    it(`should render isAll=true if knowsTheOwners is 'some'`, () => {
      req.session.appeal.appealSiteSection.siteOwnership.knowsTheOwners = 'some';
      getAdvertisingYourAppeal(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ADVERTISING_YOUR_APPEAL, {
        advertisingYourAppeal: STANDARD_TRIPLE_CONFIRM_OPTIONS,
        isOther: false,
        isAll: true,
        backLink: '/full-appeal/submit-appeal/identifying-the-owners',
      });
    });
  });

  describe('postAdvertisingYourAppeal', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'advertising-your-appeal': undefined,
          errors,
          errorSummary,
        },
      };
      req.session.appeal.appealSiteSection.agriculturalHolding.isTenant = true;

      await postAdvertisingYourAppeal(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ADVERTISING_YOUR_APPEAL, {
        advertisingYourAppeal: [],
        errors,
        errorSummary,
        isOther: false,
        isAll: false,
        backLink: '/full-appeal/submit-appeal/identifying-the-owners',
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      req = {
        ...req,
        body: {
          'advertising-your-appeal': [STANDARD_TRIPLE_CONFIRM_OPTIONS[0]],
        },
      };

      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postAdvertisingYourAppeal(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(ADVERTISING_YOUR_APPEAL, {
        advertisingYourAppeal: [STANDARD_TRIPLE_CONFIRM_OPTIONS[0]],
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
        isOther: false,
        isAll: false,
        backLink: '/full-appeal/submit-appeal/identifying-the-owners',
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
          'advertising-your-appeal': [STANDARD_TRIPLE_CONFIRM_OPTIONS[0]],
        },
      };

      await postAdvertisingYourAppeal(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${AGRICULTURAL_HOLDING}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it(`should redirect to 'Telling the landowners' page if knowsTheOwners is 'some' and user confirms the page`, async () => {
      req.session.appeal.appealSiteSection.siteOwnership.knowsTheOwners = 'some';
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'advertising-your-appeal': [STANDARD_TRIPLE_CONFIRM_OPTIONS[0]],
        },
      };

      await postAdvertisingYourAppeal(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_LANDOWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
