const {
  getBooleanQuestion,
  postBooleanQuestion,
  BOOLEAN_VIEW,
} = require('../../../../src/controllers/question-type/boolean');
const { VIEW } = require('../../../../src/lib/views');
const { createOrUpdateAppealReply } = require('../../../../src/lib/appeal-reply-api-wrapper');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeal-reply-api-wrapper');

describe('controllers/question-type/boolean', () => {
  const backLinkUrl = '/mock-id/mock-back-link';
  const page = {
    heading: 'Mock Heading',
    section: 'Mock Section',
    title: 'Mock Title',
  };
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    mockAppealReply = {
      mockTask: null,
    };

    req = mockReq(mockAppealReply);
    res = {
      ...mockRes(),
      locals: {
        questionInfo: { ...page, id: 'mockTask' },
      },
    };

    jest.resetAllMocks();
  });

  describe('getBooleanQuestion', () => {
    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;

      getBooleanQuestion(req, res);

      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: backLinkUrl,
        page,
        values: { booleanInput: null },
      });
    });

    it('it should have the correct back link when no request session object exists.', () => {
      getBooleanQuestion(req, res);

      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        page,
        values: { booleanInput: null },
      });
    });

    it('it should show values if they are available', () => {
      req.session.appealReply.mockTask = true;

      getBooleanQuestion(req, res);

      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        page,
        values: { booleanInput: true },
      });
    });
  });

  describe('postBooleanQuestion', () => {
    it('should redirect to the back link specified', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };
      mockRequest.session.backLink = `/mock-id/mock-back-link`;

      await postBooleanQuestion(mockRequest, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/mock-back-link`);
    });

    it('should redirect with input set to yes', async () => {
      mockAppealReply.mockTask = true;

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'yes',
        },
      };

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect with input set to no', async () => {
      mockAppealReply.mockTask = true;

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'no',
        },
      };

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'no',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await postBooleanQuestion(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(req.log.error).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        page,
        values: {
          booleanInput: 'no',
        },
      });
    });
    it('should re-render the template with an error if there is an API error', async () => {
      mockAppealReply.mockTask = true;

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'no',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(req.log.error).toHaveBeenCalledWith(
        { err: 'mock api error' },
        'Error creating or updating appeal'
      );
      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'mock api error' }],
        errors: {},
        page,
        values: {
          booleanInput: 'no',
        },
      });
    });
  });
});
