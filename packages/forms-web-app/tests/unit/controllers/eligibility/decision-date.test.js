const { addWeeks, subWeeks, addDays, subDays, endOfDay, format, parse } = require('date-fns');

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

const decisionDateController = require('../../../../src/controllers/eligibility/decision-date');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const config = require('../../../../src/config');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

describe('controllers/eligibility/decision-date', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getNoDecision', () => {
    it('should call the correct template', () => {
      decisionDateController.getNoDecision(req, res);
      expect(res.render).toHaveBeenCalledWith('eligibility/no-decision');
    });
  });

  describe('getDecisionDate', () => {
    it('should call the correct template decision date unevaluated', () => {
      decisionDateController.getDecisionDate(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
        decisionDate: null,
      });
    });
    it('should call the correct template with existing decision date', () => {
      const mockRequest = {
        ...req,
      };

      const decisionDate = '2000-01-01';

      mockRequest.session.appeal.decisionDate = decisionDate;

      decisionDateController.getDecisionDate(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
        decisionDate: parse(decisionDate, 'yyyy-MM-dd', new Date()),
      });
    });
  });

  describe('postDecisionDate', () => {
    it('should display the decision date passed template if the decision date is passed', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-full': '2019-10-10',
        },
      };

      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDate: '2019-10-10',
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
    });

    it('should display the decision date template with errors if any field is invalid', async () => {
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

      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
        decisionDate: parse(appeal.decisionDate, 'yyyy-MM-dd', new Date()),
        errorSummary: [],
        errors: {
          'decision-date-year': {
            msg: 'You need to provide a date',
          },
        },
      });
    });

    it('should redirect to planning department as deadline date is not passed', async () => {
      const decisionDate = addDays(subWeeks(endOfDay(new Date()), 12), 1);

      const mockRequest = {
        ...req,
        body: {
          'decision-date-full': format(decisionDate, 'yyyy-MM-dd'),
          errors: {},
          errorSummary: [],
        },
      };

      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.PLANNING_DEPARTMENT}`);
    });
    it('should redirect to decision drop out as deadline date is passed', async () => {
      const decisionDate = subDays(subWeeks(endOfDay(new Date()), 12), 1);

      const mockRequest = {
        ...req,
        body: {
          'decision-date-full': format(decisionDate, 'yyyy-MM-dd'),
          errors: {},
          errorSummary: [],
        },
      };
      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
    });

    it('should redirect to decision drop out as deadline date is passed with limited routing', async () => {
      const decisionDate = subDays(subWeeks(endOfDay(new Date()), 12), 1);
      config.server.limitedRouting.enabled = true;

      const mockRequest = {
        ...req,
        body: {
          'decision-date-full': format(decisionDate, 'yyyy-MM-dd'),
          errors: {},
          errorSummary: [],
        },
      };
      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
    });

    it('should redirect to external service on success if limitedRouted is enabled', async () => {
      config.server.limitedRouting.enabled = true;

      const mockRequest = {
        ...req,
        body: {
          errors: {},
          errorSummary: [],
        },
      };
      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(config.server.limitedRouting.serviceUrl);
    });
  });

  it('should re-render the template with errors if there is any validation error', async () => {
    const mockRequest = {
      ...req,
      body: {
        'decision-date-full': '1-1-2020',
        errors: { a: 'b' },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
      },
    };

    mockRequest.session.appeal.decisionDate = '2021-01-01';

    await decisionDateController.postDecisionDate(mockRequest, res);

    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
      decisionDate: parse(appeal.decisionDate, 'yyyy-MM-dd', new Date()),
      errorSummary: [{ text: 'There were errors here', href: '#' }],
      errors: { a: 'b' },
    });
  });

  it('should re-render the template with errors if there is any api call error', async () => {
    const mockRequest = {
      ...req,
      body: {},
    };

    const error = new Error('Cheers');
    createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

    await decisionDateController.postDecisionDate(mockRequest, res);

    expect(logger.error).toHaveBeenCalledWith(error);

    expect(res.redirect).not.toHaveBeenCalled();

    expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
      appeal: req.session.appeal,
      errors: {},
      errorSummary: [{ text: error.toString(), href: '#' }],
    });
  });

  describe('getDecisionDatePassed', () => {
    it('should call the correct template with deadline not valued', async () => {
      appeal.decisionDate = null;

      decisionDateController.getDecisionDatePassed(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
        deadlineDate: null,
      });
    });
    it('should call the correct template with deadline date being 12 weeks after decision date', () => {
      appeal.decisionDate = '2020-10-10';

      const date = addWeeks(endOfDay(parse(appeal.decisionDate, 'yyyy-MM-dd', new Date())), 12);

      decisionDateController.getDecisionDatePassed(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
        deadlineDate: date,
      });
    });
  });
});
