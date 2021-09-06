const uploadApplicationController = require('../../../../src/controllers/appellant-submission/upload-application');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { createDocument } = require('../../../../src/lib/documents-api-wrapper');
const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');
const { VIEW } = require('../../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'requiredDocumentsSection';
const taskName = 'originalApplication';

describe('controllers/appellant-submission/upload-application', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getUploadApplication', () => {
    it('should call the correct template', () => {
      uploadApplicationController.getUploadApplication(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postUploadApplication', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...mockReq(appeal),
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
        files: {
          'application-upload': {},
        },
      };
      await uploadApplicationController.postUploadApplication(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            [taskName]: {
              uploadedFile: {
                id: null,
                name: '',
              },
            },
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
        ...mockReq(appeal),
        body: {},
        files: {},
      };
      await uploadApplicationController.postUploadApplication(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
        appeal: mockRequest.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should not require req.files to be valid', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';
      const fakeNextUrl = `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`;

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: fakeNextUrl,
      });

      req = {
        ...mockReq(appeal),
        body: {},
      };
      await uploadApplicationController.postUploadApplication(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(createDocument).not.toHaveBeenCalled();

      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });

    it('should redirect to `/appellant-submission/supporting-documents` if valid', async () => {
      const fakeFileId = '123-abc';
      const fakeFileName = 'some name.jpg';
      const fakeTaskStatus = 'FAKE_STATUS';
      const fakeNextUrl = `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`;

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      createDocument.mockImplementation(() => ({
        id: fakeFileId,
        location: '00aa11bb22cc',
        size: 123,
      }));
      getNextTask.mockReturnValue({
        href: fakeNextUrl,
      });

      req = {
        ...mockReq(appeal),
        body: {},
        files: {
          'application-upload': {
            name: fakeFileName,
          },
        },
      };
      await uploadApplicationController.postUploadApplication(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            uploadedFile: {
              id: fakeFileId,
              name: fakeFileName,
              fileName: fakeFileName,
              originalFileName: fakeFileName,
              location: '00aa11bb22cc',
              size: 123,
            },
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

      expect(createDocument).toHaveBeenCalledWith(appeal, { name: fakeFileName });

      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });
  });
});
