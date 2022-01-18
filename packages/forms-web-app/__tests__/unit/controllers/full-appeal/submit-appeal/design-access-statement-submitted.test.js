const {
  getDesignAccessStatementSubmitted,
  postDesignAccessStatementSubmitted,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/design-access-statement-submitted');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DESIGN_ACCESS_STATEMENT_SUBMITTED, DECISION_LETTER },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/design-access-statement-submitted', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'planningApplicationDocumentsSection';
  const taskName = 'isDesignAccessStatementSubmitted';
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'design-access-statement-submitted': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...APPEAL_DOCUMENT.empty,
      id: appealId,
      planningApplicationDocumentsSection: {
        isDesignAccessStatementSubmitted: false,
      },
    };
    req = {
      ...mockReq(),
      body: {},
      session: {
        appeal,
      },
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getDesignAccessStatementSubmitted', () => {
    it('should call the correct template', () => {
      getDesignAccessStatementSubmitted(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
        isDesignAccessStatementSubmitted: false,
      });
    });

    it('should call the correct template when appeal.planningApplicationDocumentsSection is not defined', () => {
      delete appeal.planningApplicationDocumentsSection;

      getDesignAccessStatementSubmitted(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
        isDesignAccessStatementSubmitted: undefined,
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
        isDesignAccessStatementSubmitted: undefined,
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
        isDesignAccessStatementSubmitted: false,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
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

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DESIGN_ACCESS_STATEMENT}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'design-access-statement-submitted': 'no',
        },
      };

      await postDesignAccessStatementSubmitted(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DECISION_LETTER}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `yes` has been selected and appeal.planningApplicationDocumentsSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.planningApplicationDocumentsSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'design-access-statement-submitted': 'yes',
        },
      };

      await postDesignAccessStatementSubmitted(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DESIGN_ACCESS_STATEMENT}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and appeal.planningApplicationDocumentsSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.planningApplicationDocumentsSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'design-access-statement-submitted': 'no',
        },
      };

      await postDesignAccessStatementSubmitted(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DECISION_LETTER}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
