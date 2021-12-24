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

const decisionDateHouseholderController = require('../../../../src/controllers/householder-planning/decision-date-householder');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

describe('controllers/full-planning/decision-date-householder', () => {
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

      expect(res.render).toHaveBeenCalledWith(VIEW.HOUSEHOLDER_PLANNING.DECISION_DATE_HOUSEHOLDER, {
        backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
      });
    });
  });

  describe('postDecisionDateHouseholder', () => {
    it('should save the appeal and redirect to enforcement-notice if application decision is granted and date is within six months', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-householder-year': '2021',
          'decision-date-householder-month': '01',
          'decision-date-householder-day': '01',
        },
      };

      appeal.applicationDecision = 'GRANTED';
      global.Date.now = jest.fn(() => new Date('2021-05-01T00:00:00.000Z').getTime());

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDateHouseholder: '2021-01-01T00:00:00.000Z',
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_PLANNING.ENFORCEMENT_NOTICE}`);
    });

    it('should save the appeal and redirect to enforcement-notice if application decision is refused and date is within twelve weeks', async () => {
      const mockRequest = {
        ...req,
        body: {
          'decision-date-householder-year': '2021',
          'decision-date-householder-month': '01',
          'decision-date-householder-day': '01',
        },
      };

      appeal.applicationDecision = 'REFUSED';
      global.Date.now = jest.fn(() => new Date('2021-02-01T00:00:00.000Z').getTime());

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDateHouseholder: '2021-01-01T00:00:00.000Z',
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_PLANNING.ENFORCEMENT_NOTICE}`);
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

      appeal.applicationDecision = 'GRANTED';
      global.Date.now = jest.fn(() => new Date('2021-08-01T00:00:00.000Z').getTime());

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalledWith();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_PLANNING.YOU_CANNOT_APPEAL}`);
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

      appeal.applicationDecision = 'REFUSED';
      global.Date.now = jest.fn(() => new Date('2021-05-01T00:00:00.000Z').getTime());

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalledWith();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_PLANNING.YOU_CANNOT_APPEAL}`);
    });

    it('should display the decision date template with errors if any field is invalid', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { 'decision-date-householder-day': { msg: 'You need to provide a date' } },
        },
      };

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.HOUSEHOLDER_PLANNING.DECISION_DATE_HOUSEHOLDER, {
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

      await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.HOUSEHOLDER_PLANNING.DECISION_DATE_HOUSEHOLDER, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: 'decision-date-householder' }],
        backLink: `${VIEW.FULL_PLANNING.GRANTED_OR_REFUSED}`,
      });
    });
  });
});
