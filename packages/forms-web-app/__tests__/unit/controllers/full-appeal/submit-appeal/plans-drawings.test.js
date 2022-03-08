const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getPlansDrawings,
  postPlansDrawings,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/plans-drawings');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { PLANS_DRAWINGS, NEW_PLANS_DRAWINGS, SUPPORTING_DOCUMENTS },
  },
} = require('../../../../../src/lib/full-appeal/views');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/plans-drawings', () => {
  let req;
  let res;

  const sectionName = 'appealDocumentsSection';
  const taskName = 'plansDrawings';
  const errors = { 'plans-drawings': 'Select an option' };
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

  describe('getPlansDrawings', () => {
    it('should call the correct template', () => {
      getPlansDrawings(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANS_DRAWINGS, {
        hasPlansDrawings: true,
      });
    });
  });

  describe('postPlansDrawings', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'plans-drawings': undefined,
          errors,
          errorSummary,
        },
      };

      await postPlansDrawings(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANS_DRAWINGS, {
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postPlansDrawings(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANS_DRAWINGS, {
        hasPlansDrawings: false,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal.sectionStates.appealDocumentsSection.plansDrawings = TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'plans-drawings': 'yes',
        },
      };

      await postPlansDrawings(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${NEW_PLANS_DRAWINGS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].hasPlansDrawings = false;
      submittedAppeal.sectionStates.appealDocumentsSection.plansDrawings = TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'plans-drawings': 'no',
        },
      };

      await postPlansDrawings(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${SUPPORTING_DOCUMENTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
