const uploadQuestionController = require('../../../src/controllers/upload-question');
const {
  fileErrorSummary,
  fileUploadNunjucksVariables,
  uploadFiles,
} = require('../../../src/lib/file-upload-helpers');
const { deleteDocument } = require('../../../src/lib/documents-api-wrapper');
const logger = require('../../../src/lib/logger');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { VIEW } = require('../../../src/lib/views');
const { getTaskStatus } = require('../../../src/services/task.service');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/lib/documents-api-wrapper');
jest.mock('../../../src/lib/file-upload-helpers');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/upload-question', () => {
  const backLinkUrl = '/mock-id/mock-back-link';
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    mockAppealReply = {
      id: 'mock-id',
      mockSection: {
        mockTask: {
          uploadedFiles: [],
        },
      },
      sectionStates: {
        mockSection: {
          mockTask: 'NOT_STARTED',
        },
      },
    };

    req = mockReq(mockAppealReply);
    res = {
      ...mockRes(),
      locals: {
        routeInfo: {
          sectionName: 'mockSection',
          taskName: 'mockTask',
          view: 'mock-view',
          name: 'Mock Name',
        },
      },
    };

    jest.resetAllMocks();
  });

  describe('getUpload', () => {
    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;

      uploadQuestionController.getUpload(req, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        appealReplyId: 'mock-id',
        backLink: backLinkUrl,
      });
    });

    it('it should have the correct back link when no request session object exists.', () => {
      uploadQuestionController.getUpload(req, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        appealReplyId: 'mock-id',
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
      });
    });

    it('it should show files if they are available', () => {
      const uploadedFiles = [{ name: 'mock-file' }, { name: 'another-file' }];
      req.session.appealReply.mockSection.mockTask = uploadedFiles;

      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles,
      });

      uploadQuestionController.getUpload(req, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        appealReplyId: 'mock-id',
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        uploadedFiles,
      });
    });
  });

  describe('postUpload', () => {
    it('should delete a document from temporary files if delete is passed', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'another-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          delete: 'some-file',
          tempDocs: '{ "name": "some-file" }, { "name": "another-file" }',
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(deleteDocument).toHaveBeenCalledWith('mock-id', 'some-file');
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'another-file' }],
      });
    });

    it('should delete a document from temporary files if invalid (id is undefined)', async () => {
      fileUploadNunjucksVariables.mockReturnValue({
        uploadedFiles: [{ name: 'another-file' }],
      });

      const mockRequest = {
        ...req,
        body: {
          delete: 'undefined',
          tempDocs: '{ "name": "some-file" }, { "name": "another-file" }',
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'another-file' }],
      });
    });

    it('should log an error if delete function returns one', async () => {
      deleteDocument.mockImplementation(() => {
        throw new Error('mock delete error');
      });

      const mockRequest = {
        ...req,
        body: {
          delete: 'some-file',
          tempDocs: [],
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(logger.error).toHaveBeenCalledWith(
        { err: new Error('mock delete error') },
        'Error deleting some-file from Mock Name'
      );
    });

    it('should upload any files and add to tempDocs if submit not clicked and reload page', async () => {
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

      uploadFiles.mockReturnValue([{ name: 'some-file' }]);

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
        uploadedFiles: [{ name: 'some-file' }],
      });
    });

    it('should reload the page showing errors if there is an error uploading the files', async () => {
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

      uploadFiles.mockRejectedValue('api-error');

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
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

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload the page if there is an input error (missing files)', async () => {
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

      fileErrorSummary.mockReturnValue([{ href: 'documents', text: 'some-error' }]);

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(fileErrorSummary).toHaveBeenCalledWith('some-error', []);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should reload the page showing errors if there is an error updating the appeal', async () => {
      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('api-error');

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('mock-view', {
        appeal: null,
        backLink: '/mock-id/task-list',
      });
    });

    it('should redirect with uploaded files set and status passed', async () => {
      getTaskStatus.mockImplementation(() => 'mock-status');

      mockAppealReply.mockSection.mockTask.uploadedFiles = [{ name: 'mock-file' }];
      mockAppealReply.sectionStates.mockSection.mockTask = 'mock-status';

      uploadFiles.mockReturnValue([{ name: 'mock-file' }]);

      const mockRequest = {
        ...req,
        body: {
          submit: 'save',
        },
      };

      await uploadQuestionController.postUpload(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });
  });
});
