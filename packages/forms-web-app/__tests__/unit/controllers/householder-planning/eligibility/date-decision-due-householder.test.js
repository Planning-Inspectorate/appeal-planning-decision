const { subMonths, addDays, getYear, getMonth, getDate, startOfDay } = require('date-fns');
const { constants } = require('@pins/business-rules');

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

const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const dateDecisionDueHouseholderController = require('../../../../../src/controllers/householder-planning/eligibility/date-decision-due-householder');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../../src/lib/householder-planning/views');

describe('controllers/householder-planning/date-decision-due-householder', () => {
  let req;
  let res;

  const appeal = {
    ...householderAppeal,
    appealType: constants.APPEAL_ID.HOUSEHOLDER,
  };

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getDateDecisionDueHouseholder', () => {
    it('should call the correct template decision date unevaluated', () => {
      dateDecisionDueHouseholderController.getDateDecisionDueHouseholder(req, res);

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER,
        {
          decisionDate: null,
          backLink: `/before-you-start/granted-or-refused-householder`,
        }
      );
    });
  });

  describe('postDateDecisionDueHouseholder', () => {
    it('should save the appeal and redirect to enforcement-notice if date is within six months', async () => {
      const decisionDate = addDays(subMonths(startOfDay(new Date()), 6), 1);
      const mockRequest = {
        ...req,
        body: {
          'date-decision-due-householder-year': getYear(decisionDate),
          'date-decision-due-householder-month': getMonth(decisionDate) + 1,
          'date-decision-due-householder-day': getDate(decisionDate),
        },
      };
      mockRequest.session.appeal.eligibility.applicationDecision =
        constants.APPLICATION_DECISION.GRANTED;

      await dateDecisionDueHouseholderController.postDateDecisionDueHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDate: decisionDate.toISOString(),
      });

      expect(res.redirect).toHaveBeenCalledWith('/before-you-start/enforcement-notice-householder');
    });

    it('should not save the appeal and redirect to shutter page if date is not within six months', async () => {
      const mockRequest = {
        ...req,
        body: {
          'date-decision-due-householder-year': '2021',
          'date-decision-due-householder-month': '01',
          'date-decision-due-householder-day': '01',
        },
      };
      mockRequest.session.appeal.eligibility.applicationDecision =
        constants.APPLICATION_DECISION.REFUSED;

      global.Date.now = jest.fn(() => new Date('2021-10-01T00:00:00.000Z').getTime());

      await dateDecisionDueHouseholderController.postDateDecisionDueHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/you-cannot-appeal`);
    });

    it('should display the decision date template with errors if any field is invalid', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { 'date-decision-due-householder-day': { msg: 'You need to provide a date' } },
        },
      };

      await dateDecisionDueHouseholderController.postDateDecisionDueHouseholder(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER,
        {
          decisionDate: {
            day: undefined,
            month: undefined,
            year: undefined,
          },
          errorSummary: [],
          errors: {
            'date-decision-due-householder-day': {
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
        body: {
          'date-decision-due-householder-year': '2021',
          'date-decision-due-householder-month': '10',
          'date-decision-due-householder-day': '01',
        },
      };
      mockRequest.session.appeal.eligibility.applicationDecision =
        constants.APPLICATION_DECISION.GRANTED;

      const error = 'RangeError: Invalid time value';
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await dateDecisionDueHouseholderController.postDateDecisionDueHouseholder(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER,
        {
          decisionDate: {
            day: '01',
            month: '10',
            year: '2021',
          },
          errors: {},
          errorSummary: [{ text: error.toString(), href: 'date-decision-due-householder' }],
          backLink: `/before-you-start/granted-or-refused-householder`,
        }
      );
    });
  });
});
