const applicationNumberController = require('../../../../src/controllers/appellant-submission/application-number');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { VIEW } = require('../../../../src/lib/views');
const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'requiredDocumentsSection';
const taskName = 'applicationNumber';

describe('controllers/appellant-submission/application-number', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getApplicationNumber', () => {
    it('should call the correct template', () => {
      applicationNumberController.getApplicationNumber(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postApplicationNumber', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await applicationNumberController.postApplicationNumber(mockRequest, res);

      expect(getTaskStatus).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            [taskName]: undefined,
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {},
      };
      await applicationNumberController.postApplicationNumber(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/upload-application` if valid', async () => {
      const fakeApplicationNumber = 'some valid application number';
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
      });

      const mockRequest = {
        ...req,
        body: {
          'application-number': fakeApplicationNumber,
        },
      };

      await applicationNumberController.postApplicationNumber(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: fakeApplicationNumber,
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`);
    });
  });
});
