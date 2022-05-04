  const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const { documentTypes } = require('@pins/common');
const supportingDocumentsController = require('../../../../src/controllers/appellant-submission/supporting-documents');
const { mockReq, mockRes } = require('../../mocks');
const logger = require('../../../../src/lib/logger');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../src/lib/documents-api-wrapper');
const {
  getNextTask,
  getTaskStatus,
  setTaskStatusComplete,
} = require('../../../../src/services/task.service');
const { VIEW } = require('../../../../src/lib/views');

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
    appeal = JSON.parse(JSON.stringify(householderAppeal));
    appeal.yourAppealSection.otherDocuments.uploadedFiles = [];

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
    [
      {
        errorsIn: { a: 'b' },
        errorsOut: { a: 'b' },
      },
      {
        errorsIn: { value: 'b' },
        errorsOut: { value: 'b' },
      },
      {
        errorsIn: [{ value: { tempFilePath: '/tmp/tmp-1-1610701713557' } }],
        errorsOut: [{ value: { tempFilePath: '/tmp/tmp-1-1610701713557' } }],
      },
    ].forEach(({ errorsIn, errorsOut }) => {
      it('should re-render the template with errors if submission validation fails', async () => {
        const mockRequest = {
          ...mockReq(appeal),
          body: {
            files: {
              'supporting-documents': [],
            },
            errors: errorsIn,
            errorSummary: [{ text: 'There were errors here', href: '#' }],
          },
        };
        await supportingDocumentsController.postSupportingDocuments(mockRequest, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
          appeal: req.session.appeal,
          errorSummary: [{ text: 'There were errors here', href: '#supporting-documents-error' }],
          errors: errorsOut,
        });
      });
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      const mockRequest = {
        ...mockReq(appeal),
        body: {
          files: [],
        },
      };
      await supportingDocumentsController.postSupportingDocuments(mockRequest, res);

      expect(setTaskStatusComplete).toHaveBeenCalled();

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

    describe('conditional redirect', () => {
      let fakeFile1Id;
      let fakeFile1Name;
      let fakeFile2Id;
      let fakeFile2Name;
      let fakeTaskStatus;
      let fakeNextUrl;

      beforeEach(() => {
        fakeFile1Id = '456-cde';
        fakeFile1Name = 'another.jpg';
        fakeFile2Id = '789-xyz';
        fakeFile2Name = 'my long filename goes here.docx';
        fakeTaskStatus = 'FAKE_STATUS';
        fakeNextUrl = `/some/fake/path`;
      });

      [
        {
          nextStep: 'upload-and-remain-on-page',
          request: () => ({
            ...mockReq(appeal),
            body: {
              'upload-and-remain-on-page': 'upload-and-remain-on-page',
              files: {
                'supporting-documents': [
                  {
                    name: fakeFile1Name,
                  },
                ],
              },
            },
          }),
          expectedNextUrl: () => `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
        },
        {
          nextStep: 'task list',
          request: () => ({
            ...mockReq(appeal),
            body: {
              files: {
                'supporting-documents': [
                  {
                    name: fakeFile1Name,
                  },
                ],
              },
            },
          }),
          expectedNextUrl: () => fakeNextUrl,
        },
      ].forEach(({ nextStep, request, expectedNextUrl }) => {
        it(`should redirect - ${nextStep} - if valid - single file`, async () => {
          setTaskStatusComplete.mockImplementation(() => fakeTaskStatus);

          createDocument.mockImplementation(() => ({ id: fakeFile1Id }));
          getNextTask.mockReturnValue({
            href: fakeNextUrl,
          });

          await supportingDocumentsController.postSupportingDocuments(request(), res);

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

          expect(createDocument).toHaveBeenCalledWith(
            updatedAppeal,
            { name: fakeFile1Name },
            fakeFile1Name,
            documentTypes.otherDocuments.name
          );

          expect(res.redirect).toHaveBeenCalledWith(expectedNextUrl());
        });
      });

      [
        {
          nextStep: 'upload-and-remain-on-page',
          request: () => ({
            ...mockReq(appeal),
            body: {
              'upload-and-remain-on-page': 'upload-and-remain-on-page',
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
            },
          }),
          expectedNextUrl: () => `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
        },
        {
          nextStep: 'task list',
          request: () => ({
            ...mockReq(appeal),
            body: {
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
            },
          }),
          expectedNextUrl: () => fakeNextUrl,
        },
      ].forEach(({ nextStep, request, expectedNextUrl }) => {
        it(`should redirect - ${nextStep} if valid - multiple file`, async () => {
          setTaskStatusComplete.mockImplementation(() => fakeTaskStatus);

          createDocument
            .mockImplementationOnce(() => ({ id: fakeFile1Id }))
            .mockImplementationOnce(() => ({ id: fakeFile2Id }));

          getNextTask.mockReturnValue({
            href: fakeNextUrl,
          });

          await supportingDocumentsController.postSupportingDocuments(request(), res);

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

          expect(res.redirect).toHaveBeenCalledWith(expectedNextUrl());
        });
      });
    });
  });
});
