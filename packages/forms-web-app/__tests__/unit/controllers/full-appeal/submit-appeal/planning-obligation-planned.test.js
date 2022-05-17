const appeal = require('@pins/business-rules/test/data/full-appeal');
const planningObligationPlannedController = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-planned');
const v8 = require('v8');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const errors = {
  'plan-to-submit-planning-obligation': {
    value: undefined,
    msg: 'Select yes if you plan to submit a planning obligation',
    param: 'plan-to-submit-planning-obligation',
    location: 'body',
  },
};
const errorSummary = [
  {
    text: 'Select yes if you plan to submit a planning obligation',
    href: '#plan-to-submit-planning-obligation',
  },
];

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/planning-obligation-planned', () => {
  let req;
  let res;

  beforeEach(() => {
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {},
      })
    );
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getPlanningObligationPlanned', () => {
    it('Test getPlanningObligationPlanned method calls the correct template if new plans and drawings', async () => {
      req.session.appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = true;
      req.session.appeal.appealDocumentsSection.planningObligations.plansPlanningObligation = null;
      const backLink = `/${VIEW.FULL_APPEAL.NEW_PLANS_DRAWINGS}`;
      await planningObligationPlannedController.getPlanningObligationPlanned(req, res);

      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        backLink,
        plansPlanningObligation: null,
      });
    });
    it('Test getPlanningObligationPlanned method calls the correct template if no new plans and drawings', async () => {
      req.session.appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = false;
      req.session.appeal.appealDocumentsSection.planningObligations.plansPlanningObligation = null;
      backLink = `/${VIEW.FULL_APPEAL.PLANS_DRAWINGS}`;
      await planningObligationPlannedController.getPlanningObligationPlanned(req, res);

      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        backLink,
        plansPlanningObligation: null,
      });
    });
  });

  describe('postPlanningObligationPlanned', () => {
    it('should re-render template with errors if submission validation fails - new plans and drawings', async () => {
      req = {
        ...req,
        session: {
          appeal: {
            appealDocumentsSection: {
              plansDrawings: { hasPlansDrawings: true },
            },
          },
        },
        body: {
          errors,
          errorSummary,
        },
      };
      const backLink = `/${VIEW.FULL_APPEAL.NEW_PLANS_DRAWINGS}`;
      await planningObligationPlannedController.postPlanningObligationPlanned(req, res);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        errors,
        errorSummary,
        backLink,
      });
    });
    it('should re-render template with errors if submission validation fails - no new plans and drawings', async () => {
      req = {
        ...req,
        session: {
          appeal: {
            appealDocumentsSection: {
              plansDrawings: { hasPlansDrawings: false },
            },
          },
        },
        body: {
          errors,
          errorSummary,
          'plan-to-submit-planning-obligation': null,
        },
      };
      const backLink = `/${VIEW.FULL_APPEAL.PLANS_DRAWINGS}`;
      await planningObligationPlannedController.postPlanningObligationPlanned(req, res);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        errors,
        errorSummary,
        backLink,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await planningObligationPlannedController.postPlanningObligationPlanned(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        plansPlanningObligation: false,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to correct page if plan-to-submit-planning-obligation is yes', async () => {
      req = {
        ...req,
        body: {
          'plan-to-submit-planning-obligation': 'yes',
        },
      };
      await planningObligationPlannedController.postPlanningObligationPlanned(req, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.PLANNING_OBLIGATION_STATUS}`);
    });

    it('should redirect to correct page if plan-to-submit-planning-obligation is no', async () => {
      req = {
        ...req,
        body: {
          'plan-to-submit-planning-obligation': 'no',
        },
      };
      await planningObligationPlannedController.postPlanningObligationPlanned(req, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.SUPPORTING_DOCUMENTS}`);
    });
  });
});
