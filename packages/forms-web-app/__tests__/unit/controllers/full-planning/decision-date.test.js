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

const decisionDateController = require('../../../../src/controllers/full-planning/decision-date');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

describe('controllers/full-planning/decision-date', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getDecisionDate', () => {
    it('should call the correct template decision date unevaluated', () => {
      decisionDateController.getDecisionDate(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_PLANNING.DECISION_DATE, {
        backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
      });
    });
  });

  describe('postDecisionDate', () => {
    it('should save the appeal and redirect to enforcement-notice if date is within six months', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-year': '2021',
          'decision-date-month': '01',
          'decision-date-day': '01',
        },
      };

      global.Date.now = jest.fn(() => new Date('2021-02-01T00:00:00.000Z').getTime());

      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDate: '2021-01-01T00:00:00.000Z',
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_PLANNING.ENFORCEMENT_NOTICE}`);
    });

    it('should not save the appeal and redirect to shutter page if date is not within six months', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-year': '2021',
          'decision-date-month': '01',
          'decision-date-day': '01',
        },
      };

      global.Date.now = jest.fn(() => new Date('2021-10-01T00:00:00.000Z').getTime());

      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_PLANNING.YOU_CANNOT_APPEAL}`);
    });

    it('should display the decision date template with errors if any field is invalid', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { 'decision-date-day': { msg: 'You need to provide a date' } },
        },
      };

      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_PLANNING.DECISION_DATE, {
        decisionDate: {
          day: undefined,
          month: undefined,
          year: undefined,
        },
        errorSummary: [],
        errors: {
          'decision-date-day': {
            msg: 'You need to provide a date',
          },
        },
        backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      const error = 'RangeError: Invalid time value';
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await decisionDateController.postDecisionDate(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_PLANNING.DECISION_DATE, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: 'decision-date' }],
        backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
      });
    });
  });
});
