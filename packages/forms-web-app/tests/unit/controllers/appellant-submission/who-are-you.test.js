const whoAreYouController = require('../../../../src/controllers/appellant-submission/who-are-you');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { FORM_FIELD } = require('../../../../src/controllers/appellant-submission/who-are-you');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { getTaskStatus } = require('../../../../src/services/task.service');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

describe('controllers/appellant-submission/who-are-you', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getWhoAreYou', () => {
    it('should call the correct template', () => {
      whoAreYouController.getWhoAreYou(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
        FORM_FIELD,
        appeal: req.session.appeal,
      });
    });
  });

  describe('postWhoAreYou', () => {
    it('should redirect with original-appellant set to true', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      const mockRequest = {
        ...mockReq(appeal),
        body: {
          'original-application-your-name': 'yes',
          errors: {},
          errorSummary: {},
        },
      };

      await whoAreYouController.postWhoAreYou(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            appealingOnBehalfOf: '',
            email: null,
            isOriginalApplicant: true,
            name: null,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.render).not.toHaveBeenCalled();

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS}`);
    });

    it('should redirect with original-appellant set to false', async () => {
      const mockRequest = {
        ...mockReq(appeal),
        body: {
          'original-application-your-name': 'no',
          errors: {},
          errorSummary: {},
        },
      };

      await whoAreYouController.postWhoAreYou(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(appeal),
        body: {
          'original-application-your-name': true,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await whoAreYouController.postWhoAreYou(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
        FORM_FIELD,
        appeal,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      const mockRequest = {
        ...mockReq(appeal),
        body: {},
      };

      const error = new Error('Cheers');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await whoAreYouController.postWhoAreYou(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            appealingOnBehalfOf: '',
            email: null,
            isOriginalApplicant: undefined,
            name: null,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
        FORM_FIELD,
        appeal: mockRequest.session.appeal,
        errorSummary: [{ text: error.toString(), href: '#' }],
        errors: {},
      });
    });
  });
});
