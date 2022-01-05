const { addMonths, subMonths, addDays, subDays, endOfDay, format, parseISO } = require('date-fns');
const dateFilter = require('nunjucks-date-filter');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/config', () => ({
  logger: {
    level: 'info',
  },
  server: {
    limitedRouting: {
      serviceUrl: 'example-url',
    },
  },
}));

const dateDecisionDueController = require('../../../../src/controllers/full-planning/date-decision-due');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_PLANNING: { DATE_DECISION_DUE: currentPage },
  },
} = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

const navigationPage = {
  nextPage: '/before-you-start/enforcement-notice',
  previousPage: '/before-you-start/granted-or-refused',
  shutterPage: '/before-you-start/you-cannot-appeal',
};

describe('controllers/full-planning/date-decision-due', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);
    createOrUpdateAppeal.mockResolvedValueOnce({ eligibility: {} });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getDateDecisionDue', () => {
    it('should call the correct template date decision due unevaluated', () => {
      dateDecisionDueController.getDateDecisionDue(req, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        decisionDate: null,
        previousPage: navigationPage.previousPage,
      });
    });

    it('should call the correct template with existing date decision due', () => {
      const mockRequest = {
        ...req,
      };

      mockRequest.session.appeal.decisionDate = '2000-01-01T12:00:00.000Z';

      dateDecisionDueController.getDateDecisionDue(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        decisionDate: {
          day: '01',
          month: '01',
          year: 2000,
        },
        previousPage: navigationPage.previousPage,
      });
    });
  });

  describe('postDateDecisionDue', () => {
    it('should display the out of time shutter page template if the date decision due is passed the threshold', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date': '2019-10-10',
        },
      };

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDate: new Date('2019-10-10T12:00:00.000Z'),
      });

      expect(res.redirect).toHaveBeenCalledWith(navigationPage.shutterPage);
    });

    it('should display the date decision due template with errors if any field is invalid', async () => {
      const mockRequest = {
        ...req,
        body: {
          ...req.body,
          errors: {
            'decision-date-year': {
              msg: 'You need to provide a date',
            },
          },
        },
      };

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        decisionDate: {
          day: undefined,
          month: undefined,
          year: undefined,
        },
        errorSummary: [],
        errors: {
          'decision-date-year': {
            msg: 'You need to provide a date',
          },
        },
        previousPage: navigationPage.previousPage,
      });

      mockRequest.body['decision-date-day'] = '01';
      mockRequest.body['decision-date-month'] = '01';

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        decisionDate: {
          day: '01',
          month: '01',
          year: undefined,
        },
        errorSummary: [],
        errors: {
          'decision-date-year': {
            msg: 'You need to provide a date',
          },
        },
        previousPage: navigationPage.previousPage,
      });
    });

    it('should display the date decision due template with errors if any field is invalid', async () => {
      let mockRequest = {
        ...req,
        body: {
          'decision-date-day': '45',
          'decision-date-month': '15',
          'decision-date-year': '2021',
          errorSummary: [
            {
              text: 'The date the decision was due must be a real date',
              href: '#decision-date-day',
            },
            {
              text: 'The date the decision was due must be a real date',
              href: '#decision-date-month',
            },
          ],
          errors: {
            'decision-date-day': {
              value: '45',
              msg: 'The date the decision was due must be a real date',
              param: 'decision-date-day',
              location: 'body',
            },
            'decision-date-month': {
              value: '15',
              msg: 'The date the decision was due must be a real date',
              param: 'decision-date-month',
              location: 'body',
            },
          },
        },
      };

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        decisionDate: {
          day: '45',
          month: '15',
          year: '2021',
        },
        errorSummary: [
          {
            text: 'The date the decision was due must be a real date',
            href: '#decision-date-day',
          },
        ],
        errors: {
          'decision-date-day': {
            value: '45',
            msg: 'The date the decision was due must be a real date',
            param: 'decision-date-day',
            location: 'body',
          },
          'decision-date-month': {
            value: '15',
            msg: 'The date the decision was due must be a real date',
            param: 'decision-date-month',
            location: 'body',
          },
        },
        previousPage: navigationPage.previousPage,
      });

      mockRequest = {
        ...req,
        body: {
          'decision-date-day': '45',
          'decision-date-month': '01',
          'decision-date-year': '2021',
          errorSummary: [
            {
              text: 'The date the decision was due must be a real date',
              href: '#decision-date-day',
            },
          ],
          errors: {
            'decision-date-day': {
              value: '45',
              msg: 'The date the decision was due must be a real date',
              param: 'decision-date-day',
              location: 'body',
            },
          },
        },
      };

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        decisionDate: {
          day: '45',
          month: '01',
          year: '2021',
        },
        errorSummary: [
          {
            text: 'The date the decision was due must be a real date',
            href: '#decision-date-day',
          },
        ],
        errors: {
          'decision-date-day': {
            value: '45',
            msg: 'The date the decision was due must be a real date',
            param: 'decision-date-day',
            location: 'body',
          },
        },
        previousPage: navigationPage.previousPage,
      });
    });

    it('should display the date decision due template with errors if any field is missing', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-day': 1,
          'decision-date-month': '',
          'decision-date-year': '',
          errorSummary: [
            {
              text: 'The date the decision was due must include a month and year',
              href: '#decision-date-month',
            },
            {
              text: 'The date the decision was due must include a year',
              href: '#decision-date-year',
            },
          ],
          errors: {
            'decision-date-month': {
              value: '',
              msg: 'The date the decision was due must include a month and year',
              param: 'decision-date-month',
              location: 'body',
            },
            'decision-date-year': {
              value: '',
              msg: 'The date the decision was due must include a year',
              param: 'decision-date-year',
              location: 'body',
            },
          },
        },
      };
      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);
      expect(res.render).toHaveBeenCalledWith(currentPage, {
        decisionDate: {
          day: 1,
          month: '',
          year: '',
        },
        errorSummary: [
          {
            text: 'The date the decision was due must include a month and year',
            href: '#decision-date-month',
          },
        ],
        errors: {
          'decision-date-month': {
            value: '',
            msg: 'The date the decision was due must include a month and year',
            param: 'decision-date-month',
            location: 'body',
          },
          'decision-date-year': {
            value: '',
            msg: 'The date the decision was due must include a year',
            param: 'decision-date-year',
            location: 'body',
          },
        },
        previousPage: navigationPage.previousPage,
      });
    });

    it('should redirect to enforceent notice as deadline date is not passed', async () => {
      const decisionDate = addDays(subMonths(endOfDay(new Date()), 6), 1);

      const mockRequest = {
        ...req,
        body: {
          'decision-date': format(decisionDate, 'yyyy-MM-dd'),
          errors: {},
          errorSummary: [],
        },
      };

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(navigationPage.nextPage);
    });

    it('should redirect to out of time as deadline date is passed', async () => {
      const decisionDate = subDays(subMonths(endOfDay(new Date()), 6), 1);
      createOrUpdateAppeal.mockResolvedValueOnce({
        decisionDate: new Date(`${decisionDate}T12:00:00.000Z`),
        eligibility: {},
      });

      const mockRequest = {
        ...req,
        body: {
          'decision-date': format(decisionDate, 'yyyy-MM-dd'),
          errors: {},
          errorSummary: [],
        },
      };

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
      });

      expect(res.redirect).toHaveBeenCalledWith(navigationPage.shutterPage);
    });

    it('should re-render the date decision due template with errors if there is any api call error', async () => {
      const decisionDate = addDays(subMonths(endOfDay(new Date()), 6), 1);
      const error = new Error('Call to api failed');
      createOrUpdateAppeal.mockReset();
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      const mockRequest = {
        ...req,
        body: {
          'decision-date': format(decisionDate, 'yyyy-MM-dd'),
          errors: {},
          errorSummary: [],
        },
      };

      await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
      });

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
        previousPage: navigationPage.previousPage,
      });
    });
  });
});
