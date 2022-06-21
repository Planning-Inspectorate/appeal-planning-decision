const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getWhyInquiry,
  postWhyInquiry,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/why-inquiry');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { EXPECT_ENQUIRY_LAST, WHY_INQUIRY },
  },
} = require('../../../../../src/lib/full-appeal/views');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../../../../src/controllers/save');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/controllers/save');

describe('controllers/full-appeal/submit-appeal/why-inquiry', () => {
  let req;
  let res;

  const sectionName = 'appealDecisionSection';
  const taskName = 'inquiry';
  const errors = { 'why-inquiry': 'Select an option' };
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

  describe('getWhyInquiry', () => {
    it('should call the correct template', () => {
      getWhyInquiry(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(WHY_INQUIRY, {
        reason: appeal[sectionName][taskName].reason,
      });
    });
  });

  describe('postWhyInquiry', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'why-inquiry': appeal[sectionName][taskName].reason,
          errors,
          errorSummary,
        },
      };

      await postWhyInquiry(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(WHY_INQUIRY, {
        reason: appeal[sectionName][taskName].reason,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      req = {
        ...req,
        body: {
          'why-inquiry': appeal[sectionName][taskName].reason,
        },
      };

      await postWhyInquiry(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(WHY_INQUIRY, {
        reason: appeal[sectionName][taskName].reason,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if a valid value has been entered', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal.sectionStates.appealDecisionSection.inquiry = TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'why-inquiry': appeal[sectionName][taskName].reason,
        },
      };

      await postWhyInquiry(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${EXPECT_ENQUIRY_LAST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should re-render the template with errors if submission validation fails (save and return)', async () => {
      req = {
        ...req,
        body: {
          'save-and-return': '',
          'why-inquiry': appeal[sectionName][taskName].reason,
          errors,
          errorSummary,
        },
      };

      await postWhyInquiry(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(postSaveAndReturn).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(WHY_INQUIRY, {
        reason: appeal[sectionName][taskName].reason,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown (save and return)', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      req = {
        ...req,
        body: {
          'save-and-return': '',
          'why-inquiry': appeal[sectionName][taskName].reason,
        },
      };

      await postWhyInquiry(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(postSaveAndReturn).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(WHY_INQUIRY, {
        reason: appeal[sectionName][taskName].reason,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if a valid value has been entered (save and return)', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal.sectionStates.appealDecisionSection.inquiry = TASK_STATUS.IN_PROGRESS;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'save-and-return': '',
          'why-inquiry': appeal[sectionName][taskName].reason,
        },
      };

      await postWhyInquiry(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(postSaveAndReturn).toHaveBeenCalledWith(req, res);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
