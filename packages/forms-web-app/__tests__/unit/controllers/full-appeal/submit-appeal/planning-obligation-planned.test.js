const planningObligationPlannedController = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-planned');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');

const appeal = require('@pins/business-rules/test/data/full-appeal');

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

describe('controllers/full-appeal/submit-appeal/planning-obligation-planned', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();
  });

  describe('getPlanningObligationPlanned', () => {
    it('Test getPlanningObligationPlanned method calls the correct template if new plans and drawings', async () => {
      req.session.appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = true;
      backLink = `/${VIEW.FULL_APPEAL.NEW_PLANS_DRAWINGS}`;
      await planningObligationPlannedController.getPlanningObligationPlanned(req, res);

      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        backLink,
      });
    });
    it('Test getPlanningObligationPlanned method calls the correct template if no new plans and drawings', async () => {
      req.session.appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = false;
      backLink = `/${VIEW.FULL_APPEAL.PLANS_DRAWINGS}`;
      await planningObligationPlannedController.getPlanningObligationPlanned(req, res);

      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        backLink,
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
      backLink = `/${VIEW.FULL_APPEAL.NEW_PLANS_DRAWINGS}`;
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
      backLink = `/${VIEW.FULL_APPEAL.PLANS_DRAWINGS}`;
      await planningObligationPlannedController.postPlanningObligationPlanned(req, res);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
        errors,
        errorSummary,
        backLink,
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
