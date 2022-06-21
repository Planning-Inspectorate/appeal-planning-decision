const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getExpectInquiryLast,
  postExpectInquiryLast,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/expect-inquiry-last');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { EXPECT_ENQUIRY_LAST, DRAFT_STATEMENT_COMMON_GROUND },
  },
} = require('../../../../../src/lib/full-appeal/views');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../../../../src/controllers/save');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/controllers/save');

describe('controllers/full-appeal/submit-appeal/expect-inquiry-last', () => {
  let req;
  let res;

  const sectionName = 'appealDecisionSection';
  const taskName = 'inquiry';
  const errors = { 'expected-days': 'Select an option' };
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

  describe('getExpectInquiryLast', () => {
    it('should call the correct template', () => {
      getExpectInquiryLast(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(EXPECT_ENQUIRY_LAST, {
        expectedDays: appeal[sectionName][taskName].expectedDays,
      });
    });
  });

  describe('postExpectInquiryLast', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'expected-days': appeal[sectionName][taskName].expectedDays,
          errors,
          errorSummary,
        },
      };

      await postExpectInquiryLast(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(EXPECT_ENQUIRY_LAST, {
        expectedDays: appeal[sectionName][taskName].expectedDays,
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
          'expected-days': appeal[sectionName][taskName].expectedDays,
        },
      };

      await postExpectInquiryLast(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(EXPECT_ENQUIRY_LAST, {
        expectedDays: appeal[sectionName][taskName].expectedDays,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if a valid value has been entered', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal.sectionStates.appealDecisionSection.inquiryExpectedDays =
        TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'expected-days': appeal[sectionName][taskName].expectedDays,
        },
      };

      await postExpectInquiryLast(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DRAFT_STATEMENT_COMMON_GROUND}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should re-render the template with errors if submission validation fails (save and return)', async () => {
      req = {
        ...req,
        body: {
          'save-and-return': '',
          'expected-days': appeal[sectionName][taskName].expectedDays,
          errors,
          errorSummary,
        },
      };

      await postExpectInquiryLast(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(postSaveAndReturn).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(EXPECT_ENQUIRY_LAST, {
        expectedDays: appeal[sectionName][taskName].expectedDays,
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
          'expected-days': appeal[sectionName][taskName].expectedDays,
        },
      };

      await postExpectInquiryLast(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(postSaveAndReturn).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(EXPECT_ENQUIRY_LAST, {
        expectedDays: appeal[sectionName][taskName].expectedDays,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if a valid value has been entered (save and return)', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal.sectionStates.appealDecisionSection.inquiryExpectedDays =
        TASK_STATUS.IN_PROGRESS;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'save-and-return': '',
          'expected-days': appeal[sectionName][taskName].expectedDays,
        },
      };

      await postExpectInquiryLast(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(postSaveAndReturn).toHaveBeenCalledWith(req, res);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
