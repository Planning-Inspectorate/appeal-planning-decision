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

const dateDecisionDueHouseholderController = require('../../../../../src/controllers/householder-planning/eligibility/date-decision-due-householder');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../../src/lib/householder-planning/views');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');

describe('controllers/householder-planning/date-decision-due-householder', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getDateDecisionDueHouseholder', () => {
    it('should call the correct template decision date unevaluated', () => {
      dateDecisionDueHouseholderController.getDateDecisionDueHouseholder(req, res);

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER,
        {
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

      const error = 'RangeError: Invalid time value';
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await dateDecisionDueHouseholderController.postDateDecisionDueHouseholder(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(
        VIEW.HOUSEHOLDER_PLANNING.ELIGIBILITY.DATE_DECISION_DUE_HOUSEHOLDER,
        {
          appeal: req.session.appeal,
          errors: {},
          errorSummary: [{ text: error.toString(), href: 'date-decision-due-householder' }],
          backLink: `/before-you-start/granted-or-refused-householder`,
        }
      );
    });
  });
});
