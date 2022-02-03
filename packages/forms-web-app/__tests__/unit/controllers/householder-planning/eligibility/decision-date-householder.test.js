const { subMonths, addDays, getYear, getMonth, getDate, startOfDay } = require('date-fns');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');
jest.mock('../../../../../src/config', () => ({
  logger: {
    level: 'info',
  },
  server: {
    limitedRouting: {
      serviceUrl: 'example-url',
    },
  },
}));

const sinon = require('sinon');
const { rules, validation } = require('@pins/business-rules');
const decisionDateHouseholderController = require('../../../../../src/controllers/householder-planning/eligibility/decision-date-householder');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../../src/lib/householder-planning/views');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');

describe('controllers/householder-planning/eligibility/decision-date-householder', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getDecisionDateHouseholder', () => {
    it('should call the correct template decision date unevaluated', () => {
      decisionDateHouseholderController.getDecisionDateHouseholder(req, res);

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DECISION_DATE_HOUSEHOLDER,
        {
          backLink: `/before-you-start/granted-or-refused-householder`,
        }
      );
    });
  });

  describe('postDecisionDateHouseholder', () => {
    it('should save the appeal and redirect to enforcement-notice-householder if application decision is granted and date is within six months', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-householder-year': '2021',
          'decision-date-householder-month': '01',
          'decision-date-householder-day': '01',
        },
      };

      appeal.eligibility.applicationDecision = 'granted';
      global.Date.now = jest.fn(() => new Date('2021-05-01T00:00:00.000Z').getTime());

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDate: '2021-01-01T00:00:00.000Z',
      });

      expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/enforcement-notice-householder`);
    });

    it('should save the appeal and redirect to enforcement-notice-householder if application decision is refused and date is within twelve weeks', async () => {
      const decisionDate = addDays(subMonths(startOfDay(new Date()), 1), 1);
      const mockRequest = {
        ...req,
        body: {
          'decision-date-householder-year': getYear(decisionDate),
          'decision-date-householder-month': getMonth(decisionDate) + 1,
          'decision-date-householder-day': getDate(decisionDate),
        },
      };

      appeal.eligibility.applicationDecision = 'refused';

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDate: decisionDate.toISOString(),
      });

      expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/enforcement-notice-householder`);
    });

    it('should not save the appeal and redirect to you-cannot-appeal if application decision is granted and date is older than six months', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-householder-year': '2021',
          'decision-date-householder-month': '01',
          'decision-date-householder-day': '01',
        },
      };

      appeal.eligibility.applicationDecision = 'granted';
      global.Date.now = jest.fn(() => new Date('2021-08-01T00:00:00.000Z').getTime());

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalledWith();
      expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/you-cannot-appeal`);
    });

    it('should not save the appeal and redirect to you-cannot-appeal if application decision is refused and date is older than twelve weeks', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-householder-year': '2021',
          'decision-date-householder-month': '01',
          'decision-date-householder-day': '01',
        },
      };

      appeal.eligibility.applicationDecision = 'refused';
      global.Date.now = jest.fn(() => new Date('2021-05-01T00:00:00.000Z').getTime());

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalledWith();
      expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/you-cannot-appeal`);
    });

    it('should display the decision date template with errors if any field is invalid', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { 'decision-date-householder-day': { msg: 'You need to provide a date' } },
        },
      };

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DECISION_DATE_HOUSEHOLDER,
        {
          decisionDateHouseholder: {
            day: undefined,
            month: undefined,
            year: undefined,
          },
          errorSummary: [],
          errors: {
            'decision-date-householder-day': {
              msg: 'You need to provide a date',
            },
          },
          backLink: `/before-you-start/granted-or-refused-householder`,
        }
      );
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      sinon.replace(rules.appeal, 'deadlineDate', () => new Date().toISOString());
      sinon.replace(rules.appeal, 'deadlinePeriod', () => ({ time: 1, period: 'weeks' }));
      sinon.replace(validation.appeal.decisionDate, 'isWithinDecisionDateExpiryPeriod', () => true);

      const error = 'RangeError: Invalid time value';
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DECISION_DATE_HOUSEHOLDER,
        {
          appeal: req.session.appeal,
          errors: {},
          errorSummary: [{ text: error.toString(), href: 'decision-date-householder' }],
          backLink: `/before-you-start/granted-or-refused-householder`,
        }
      );
    });
  });
});
