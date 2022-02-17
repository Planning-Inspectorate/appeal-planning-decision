const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getWhyInquiry,
  postWhyInquiry,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/why-inquiry');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { EXPECT_ENQUIRY_LAST, WHY_INQUIRY },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

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

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

      req = {
        ...req,
        body: {
          'why-inquiry': appeal[sectionName][taskName].reason,
        },
      };

      await postWhyInquiry(req, res);

      // expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${EXPECT_ENQUIRY_LAST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
