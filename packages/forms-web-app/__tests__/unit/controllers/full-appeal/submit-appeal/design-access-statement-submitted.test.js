const {
  constants: {
    APPLICATION_DECISION: { GRANTED, NODECISIONRECEIVED, REFUSED },
  },
} = require('@pins/business-rules');
const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getDesignAccessStatementSubmitted,
  postDesignAccessStatementSubmitted,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/design-access-statement-submitted');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: {
      DECISION_LETTER,
      DESIGN_ACCESS_STATEMENT_SUBMITTED,
      DESIGN_ACCESS_STATEMENT,
      LETTER_CONFIRMING_APPLICATION,
    },
  },
} = require('../../../../../src/lib/full-appeal/views');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/design-access-statement-submitted', () => {
  let req;
  let res;

  const sectionName = 'planningApplicationDocumentsSection';
  const taskName = 'designAccessStatement';
  const errors = { 'design-access-statement-submitted': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

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

  describe('getDesignAccessStatementSubmitted', () => {
    it('should call the correct template', () => {
      getDesignAccessStatementSubmitted(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
        isSubmitted: true,
      });
    });
  });

  describe('postDesignAccessStatementSubmitted', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'design-access-statement-submitted': undefined,
          errors,
          errorSummary,
        },
      };

      await postDesignAccessStatementSubmitted(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
        isSubmitted: undefined,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postDesignAccessStatementSubmitted(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
        isSubmitted: false,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatementSubmitted =
        TASK_STATUS.COMPLETED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'design-access-statement-submitted': 'yes',
        },
      };

      await postDesignAccessStatementSubmitted(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DESIGN_ACCESS_STATEMENT}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and the application decision is `granted`', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatementSubmitted =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = GRANTED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].isSubmitted = false;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'design-access-statement-submitted': 'no',
        },
      };
      req.session.appeal.eligibility.applicationDecision = GRANTED;

      await postDesignAccessStatementSubmitted(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DECISION_LETTER}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and the application decision is `refused`', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatementSubmitted =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = REFUSED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].isSubmitted = false;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'design-access-statement-submitted': 'no',
        },
      };
      req.session.appeal.eligibility.applicationDecision = REFUSED;

      await postDesignAccessStatementSubmitted(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DECISION_LETTER}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and the application decision is `no decision received`', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatementSubmitted =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = NODECISIONRECEIVED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].isSubmitted = false;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'design-access-statement-submitted': 'no',
        },
      };
      req.session.appeal.eligibility.applicationDecision = NODECISIONRECEIVED;

      await postDesignAccessStatementSubmitted(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${LETTER_CONFIRMING_APPLICATION}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
