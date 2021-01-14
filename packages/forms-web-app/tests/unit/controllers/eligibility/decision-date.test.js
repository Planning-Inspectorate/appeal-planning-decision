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
const config = require('../../../../src/config');

const req = mockReq();
const res = mockRes();

describe('controllers/eligibility/decision-date', () => {
  describe('getNoDecision', () => {
    it('should call the correct template', () => {
      decisionDateController.getNoDecision(req, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/no-decision');
    });
  });

  describe('getDecisionDate', () => {
    it('should call the correct template', () => {
      decisionDateController.getDecisionDate(req, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/decision-date');
    });
  });

  describe('postDecisionDate', () => {
    it('should display the decision date expired template if the decision date is expired', () => {
      const badReq = {
        ...req,
        body: {
          ...req.body,
          errors: {
            'decision-date': {
              msg: JSON.stringify({
                deadlineDate: 'A deadline date here',
              }),
            },
          },
        },
      };
      decisionDateController.postDecisionDate(badReq, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/decision-date-expired', {
        errorSummary: [],
        errors: {
          'decision-date': {
            msg: '{"deadlineDate":"A deadline date here"}',
          },
        },
        deadlineDate: 'A deadline date here',
      });
    });

    it('should display the decision date template with errors if any field is invalid', () => {
      const badReq = {
        ...req,
        body: {
          ...req.body,
          errors: {
            'decision-date-year': {
              msg: 'Invalid date',
            },
          },
        },
      };
      decisionDateController.postDecisionDate(badReq, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/decision-date', {
        errorSummary: [],
        errors: {
          'decision-date-year': {
            msg: 'Invalid date',
          },
        },
      });
    });

    it('should redirect on success', () => {
      const happyReq = {
        ...req,
        body: {
          errors: {},
          errorSummary: [],
        },
      };
      decisionDateController.postDecisionDate(happyReq, res);

      expect(res.redirect).toHaveBeenCalledWith('/eligibility/planning-department');
    });

    it('should redirect to external service on success if limitedRouted is enabled', () => {
      config.server.limitedRouting.enabled = true;

      const happyReq = {
        ...req,
        body: {
          errors: {},
          errorSummary: [],
        },
      };
      decisionDateController.postDecisionDate(happyReq, res);

      expect(res.redirect).toHaveBeenCalledWith(config.server.limitedRouting.serviceUrl);
    });
  });

  describe('getDecisionDateExpired', () => {
    it('should call the correct template', () => {
      decisionDateController.getDecisionDateExpired(req, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/decision-date-expired');
    });
  });
});
