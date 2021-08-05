const {
  getBooleanQuestion,
  postBooleanQuestion,
  BOOLEAN_VIEW,
} = require('../../../../src/controllers/question-type/boolean');
const { VIEW } = require('../../../../src/lib/views');
const { createOrUpdateAppealReply } = require('../../../../src/lib/appeal-reply-api-wrapper');
const { mockReq, mockRes } = require('../../mocks');
const { renderView } = require('../../../../src/util/render');

jest.mock('../../../../src/lib/appeal-reply-api-wrapper');

describe('controllers/question-type/boolean', () => {
  const backLinkUrl = '/appeal-questionnaire/mock-id/mock-back-link';
  let question;
  let questionText;
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    question = {
      id: 'mockTask',
      heading: 'Mock Heading',
      section: 'Mock Section',
      title: 'Mock Title',
    };

    questionText = {
      ...question,
      dataId: 'mockBoolId',
      text: {
        id: 'mockTextId',
        parentValue: true,
        label: 'Mock text label',
      },
    };

    mockAppealReply = {
      mockTask: null,
    };

    req = mockReq(mockAppealReply);
    res = {
      ...mockRes(),
      locals: {
        question,
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
        question,
        values: { booleanInput: null },
      });
    });

    it('it should have the correct back link when no request session object exists.', () => {
      getBooleanQuestion(req, res);

      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        question,
        values: { booleanInput: null },
      });
    });

    it('it should show yes or no values if they are available', () => {
      req.session.appealReply.mockTask = true;

      getBooleanQuestion(req, res);

      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        question,
        values: { booleanInput: true },
      });
    });

    it('it should show yes or no and text values if they are available', () => {
      req.session.appealReply.mockTask = {
        mockBoolId: true,
        mockTextId: 'Mock text value',
        value: true,
      };

      const expectedResult = {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        question: questionText,
        values: {
          booleanInput: true,
          booleanInputText: 'Mock text value',
        },
      };

      res.locals.question = questionText;

      getBooleanQuestion(req, res);
      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, expectedResult);

      res.locals.question.dataId = undefined;
      getBooleanQuestion(req, res);
      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, expectedResult);
    });
  });

  describe('postBooleanQuestion', () => {
    it('should populate appealReply with a positive input and associated text', async () => {
      const expectedReply = {
        'mock-id': {
          'mock-data-id': true,
          text: {
            'mock-text-id': 'mock-text',
          },
        },
      };

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'yes',
          booleanInputText: 'mock-text',
        },
        session: {
          appealReply: {
            ...expectedReply,
          },
        },
      };

      const mockResponse = {
        ...res,
        locals: {
          question: {
            id: 'mock-id',
            dataId: 'mock-data-id',
            text: {
              id: 'mock-text-id',
            },
          },
        },
      };

      await postBooleanQuestion(mockRequest, mockResponse);
      expect(res.render).not.toHaveBeenCalled();
      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
    });

    it('should populate appealReply with a positive input and associated text, even if data section missing', async () => {
      const expectedReply = {
        'mock-id': {
          'mock-data-id': true,
          'mock-text-id': 'mock-text',
        },
      };

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'yes',
          booleanInputText: 'mock-text',
        },
        session: {
          appealReply: {},
        },
      };

      const mockResponse = {
        ...res,
        locals: {
          question: {
            id: 'mock-id',
            dataId: 'mock-data-id',
            text: {
              id: 'mock-text-id',
            },
          },
        },
      };

      await postBooleanQuestion(mockRequest, mockResponse);
      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
    });

    it('should populate appealReply with a negative input and blank text, regardless of text box being populated', async () => {
      const expectedReply = {
        'mock-id': {
          'mock-data-id': false,
          text: {
            'mock-text-id': '',
          },
        },
      };

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'no',
          booleanInputText: 'mock-text',
        },
        session: {
          appealReply: {
            ...expectedReply,
          },
        },
      };

      const mockResponse = {
        ...res,
        locals: {
          question: {
            id: 'mock-id',
            dataId: 'mock-data-id',
            text: {
              id: 'mock-text-id',
            },
          },
        },
      };

      await postBooleanQuestion(mockRequest, mockResponse);
      expect(res.render).not.toHaveBeenCalled();
      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
    });

    it('should redirect to the back link specified', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };
      mockRequest.session.backLink = `/mock-id/mock-back-link`;

      await postBooleanQuestion(mockRequest, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/mock-back-link`);
    });

    it('should redirect with input set to yes', async () => {
      const expectedReply = {
        ...mockAppealReply,
        mockTask: true,
      };

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'yes',
        },
      };

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect with input set to no', async () => {
      const expectedReply = {
        mockTask: false,
      };

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'no',
        },
      };

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect with text input and dataId set', async () => {
      const expectedReply = {
        mockTask: {
          mockBoolId: true,
          mockTextId: 'Mock text value',
        },
      };

      const mockRequest = {
        ...mockReq({ ...expectedReply }),
        body: {
          booleanInput: 'no',
          booleanInputText: 'Mock text value',
        },
      };

      res.locals.question = questionText;

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect with text input set and dataId not set', async () => {
      const expectedReply = {
        mockTask: {
          value: true,
          mockTextId: 'Mock text value',
        },
      };

      const mockRequest = {
        ...mockReq({ ...expectedReply }),
        body: {
          booleanInput: 'no',
          booleanInputText: 'Mock text value',
        },
      };

      res.locals.question = { ...questionText, dataId: '' };

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
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
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        question,
        values: {
          booleanInput: 'no',
          booleanInputText: '',
        },
      });
    });
    it('should re-render the template with an error if there is an API error', async () => {
      const expectedReply = {
        ...mockAppealReply,
        mockTask: false,
      };

      const mockRequest = {
        ...req,
        body: {
          booleanInput: 'no',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await postBooleanQuestion(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedReply);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(req.log.error).toHaveBeenCalledWith(
        { err: 'mock api error' },
        'Error creating or updating appeal'
      );
      expect(res.render).toHaveBeenCalledWith(BOOLEAN_VIEW, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'mock api error' }],
        errors: {},
        question,
        values: {
          booleanInput: 'no',
          booleanInputText: '',
        },
      });
    });
  });
});
