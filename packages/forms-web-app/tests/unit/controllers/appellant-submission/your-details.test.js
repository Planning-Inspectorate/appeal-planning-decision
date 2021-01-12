const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const yourDetailsController = require('../../../../src/controllers/appellant-submission/your-details');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { getTaskStatus, getNextUncompletedTask } = require('../../../../src/services/task.service');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/empty-appeal');
jest.mock('../../../../src/lib/logger');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

describe('controllers/appellant-submission/your-details', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getYourDetails', () => {
    it('should call the correct template', () => {
      yourDetailsController.getYourDetails(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postYourDetails', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            [taskName]: {
              appealingOnBehalfOf: '',
              email: undefined,
              isOriginalApplicant: null,
              name: undefined,
            },
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });

      expect(getTaskStatus).not.toHaveBeenCalled();
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      const mockRequest = {
        ...req,
        body: {},
      };

      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
        appeal: req.session.appeal,
        errorSummary: [{ text: error.toString(), href: '#' }],
        errors: {},
      });
    });

    it('should redirect to task list if valid and original appellant', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';
      const fakeNextUrl = `/fake/url/goes/here`;

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextUncompletedTask.mockReturnValue({
        href: fakeNextUrl,
      });

      const mockRequest = {
        ...req,
        body: {},
        session: {
          appeal: {
            ...appeal,
            [sectionName]: {
              ...appeal[sectionName],
              [taskName]: {
                appealingOnBehalfOf: 'Someone else',
                email: undefined,
                isOriginalApplicant: true,
                name: undefined,
              },
            },
            sectionStates: {
              ...appeal.sectionStates,
              [sectionName]: {
                ...appeal.sectionStates[sectionName],
                [taskName]: fakeTaskStatus,
              },
            },
          },
        },
      };

      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            appealingOnBehalfOf: null,
            email: undefined,
            isOriginalApplicant: true,
            name: undefined,
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

      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });

    it('should redirect to the applicant name page if valid and not the original appellant', async () => {
      const fakeEmail = 'jim@joe.com';
      const fakeName = 'Jim Joe';
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      const mockRequest = {
        ...mockReq(appeal),
        body: {
          'appellant-email': fakeEmail,
          'appellant-name': fakeName,
        },
      };

      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            appealingOnBehalfOf: '',
            email: fakeEmail,
            isOriginalApplicant: null,
            name: fakeName,
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME}`);

      expect(getNextUncompletedTask).not.toHaveBeenCalled();
    });
  });
});
