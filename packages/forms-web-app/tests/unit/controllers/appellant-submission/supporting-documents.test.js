const supportingDocumentsController = require('../../../../src/controllers/appellant-submission/supporting-documents');
const { mockReq, mockRes } = require('../../mocks');
const logger = require('../../../../src/lib/logger');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../src/lib/documents-api-wrapper');
const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');
const { VIEW } = require('../../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'yourAppealSection';
const taskName = 'otherDocuments';

describe('controllers/appellant-submission/supporting-documents', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    appeal = JSON.parse(JSON.stringify(APPEAL_DOCUMENT.empty));

    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getSupportingDocuments', () => {
    it('should call the correct template', () => {
      supportingDocumentsController.getSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postSupportingDocuments', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...mockReq(appeal),
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
        files: {
          'supporting-documents': {},
        },
      };
      await supportingDocumentsController.postSupportingDocuments(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            [taskName]: {
              uploadedFiles: [],
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
      await supportingDocumentsController.postSupportingDocuments(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
        appeal: mockRequest.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should not require req.files to be valid', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';
      const fakeNextUrl = `/some/fake/path`;

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: fakeNextUrl,
      });

      req = {
        ...mockReq(appeal),
        body: {},
      };
      await supportingDocumentsController.postSupportingDocuments(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(createDocument).not.toHaveBeenCalled();

      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });

    it('should redirect to the task list if valid - single file', async () => {
      const fakeFileId = '123-abc';
      const fakeFileName = 'some name.jpg';
      const fakeTaskStatus = 'FAKE_STATUS';
      const fakeNextUrl = `/some/fake/path`;

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      createDocument.mockImplementation(() => ({ id: fakeFileId }));
      getNextTask.mockReturnValue({
        href: fakeNextUrl,
      });

      req = {
        ...mockReq(appeal),
        body: {},
        files: {
          'supporting-documents': {
            name: fakeFileName,
          },
        },
      };
      await supportingDocumentsController.postSupportingDocuments(req, res);

      const updatedAppeal = {
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            uploadedFiles: [
              {
                fileName: fakeFileName,
                id: fakeFileId,
                location: undefined,
                message: {
                  text: fakeFileName,
                },
                name: fakeFileName,
                originalFileName: fakeFileName,
                size: undefined,
              },
            ],
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      };

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(updatedAppeal);

      expect(createDocument).toHaveBeenCalledWith(updatedAppeal, { name: fakeFileName });

      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });

    it('should redirect to the task list if valid - multiple file', async () => {
      const fakeFile1Id = '456-cde';
      const fakeFile1Name = 'another.jpg';
      const fakeFile2Id = '789-xyz';
      const fakeFile2Name = 'my long filename goes here.docx';
      const fakeTaskStatus = 'FAKE_STATUS';
      const fakeNextUrl = `/some/fake/path`;

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      createDocument
        .mockImplementationOnce(() => ({ id: fakeFile1Id }))
        .mockImplementationOnce(() => ({ id: fakeFile2Id }));

      getNextTask.mockReturnValue({
        href: fakeNextUrl,
      });

      req = {
        ...mockReq(appeal),
        body: {},
        files: {
          'supporting-documents': [
            {
              name: fakeFile1Name,
            },
            {
              name: fakeFile2Name,
            },
          ],
        },
      };
      await supportingDocumentsController.postSupportingDocuments(req, res);

      const updatedAppeal = {
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            uploadedFiles: [
              {
                fileName: fakeFile1Name,
                id: fakeFile1Id,
                location: undefined,
                message: {
                  text: fakeFile1Name,
                },
                name: fakeFile1Name,
                originalFileName: fakeFile1Name,
                size: undefined,
              },
              {
                fileName: fakeFile2Name,
                id: fakeFile2Id,
                location: undefined,
                message: {
                  text: fakeFile2Name,
                },
                name: fakeFile2Name,
                originalFileName: fakeFile2Name,
                size: undefined,
              },
            ],
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      };

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(updatedAppeal);

      expect(createDocument.mock.calls[0][0]).toEqual(appeal, { name: fakeFile1Name });
      expect(createDocument.mock.calls[1][0]).toEqual(appeal, { name: fakeFile2Name });

      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });
  });
});
