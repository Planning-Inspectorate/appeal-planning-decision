const uploadPlansController = require('../../../src/controllers/upload-plans');
const {
  fileErrorSummary,
  fileUploadNunjucksVariables,
  deleteFile,
  uploadFiles,
} = require('../../../src/lib/file-upload-helpers');
const logger = require('../../../src/lib/logger');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { VIEW } = require('../../../src/lib/views');
const emptyAppealReply = require('../../../src/lib/empty-appeal-reply');
const { getTaskStatus } = require('../../../src/services/task.service');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/lib/file-upload-helpers');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/upload-plans', () => {
  const backLinkUrl = '/mock-id/mock-back-link';
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    mockAppealReply = { ...emptyAppealReply };

    req = mockReq(mockAppealReply);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getUploadPlans', () => {
    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;
      uploadPlansController.getUploadPlans(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: backLinkUrl,
        uploadedFiles: [],
      });
    });

    it('it should have the correct back link when no request session object exists.', () => {
      uploadPlansController.getUploadPlans(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        uploadedFiles: [],
      });
    });
  });

  describe('postUploadPlans', () => {
    it('should delete a document from temporary files if delete is passed', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'another-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          delete: 'some-file',
        },
        session: {
          uploadedFiles: [{ name: 'some-file' }, { name: 'another-file' }],
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(deleteFile).toHaveBeenCalledWith('some-file', mockRequest);
      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'another-file' }],
      });
    });

    it('should log an error if delete function returns one', async () => {
      deleteFile.mockImplementation(() => {
        throw new Error('mock delete error');
      });

      const mockRequest = {
        ...req,
        body: {
          delete: 'some-file',
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(logger.error).toHaveBeenCalledWith(
        { err: new Error('mock delete error') },
        'Error deleting some-file from Upload Plans'
      );
    });

    it('should pass uploaded files to session files if submit not clicked and reload page', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'some-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          files: {
            documents: [
              {
                name: 'some-file',
              },
            ],
          },
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(mockRequest.session.uploadedFiles).toEqual([{ name: 'some-file' }], mockRequest);
      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'some-file' }],
      });
    });

    it('should add to existing session files if files present and submit not clicked, then reload page', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'original-file' }, { name: 'some-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          files: {
            documents: [
              {
                name: 'some-file',
              },
            ],
          },
        },
        session: {
          uploadedFiles: [{ name: 'original-file' }],
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(mockRequest.session.uploadedFiles).toEqual(
        [{ name: 'original-file' }, { name: 'some-file' }],
        mockRequest
      );
      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'original-file' }, { name: 'some-file' }],
      });
    });

    it('should reload page showing errors if error summary populated', async () => {
      fileErrorSummary.mockReturnValue([{ error: true }]);
      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload the page if there is an input error (missing files)', async () => {
      uploadFiles.mockRejectedValue('mock-error');

      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
          errors: {
            documents: {
              msg: 'some-error',
            },
          },
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(fileErrorSummary).toHaveBeenCalledWith('some-error', undefined);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload the page showing errors if there is an error uploading files', async () => {
      uploadFiles.mockRejectedValue('mock-error');

      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload the page showing errors if there is an error uploading files', async () => {
      uploadFiles.mockReturnValue([{ name: 'mock-file' }]);
      createOrUpdateAppealReply.mockRejectedValue('api-error');

      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should redirect with uploaded files set and status passed', async () => {
      getTaskStatus.mockImplementation(() => 'mock-status');

      mockAppealReply.requiredDocumentsSection.plansDecision.uploadedFiles = [
        { name: 'mock-file' },
      ];
      mockAppealReply.sectionStates.requiredDocumentsSection.plansDecision = 'mock-status';

      uploadFiles.mockReturnValue([{ name: 'mock-file' }]);

      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      await uploadPlansController.postUploadPlans(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });
  });
});
