const uploadPlansController = require('../../../src/controllers/upload-plans');
const {
  fileErrorSummary,
  fileUploadNunjucksVariables,
} = require('../../../src/lib/file-upload-helpers');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/upload-plans', () => {
  const backLinkUrl = '/mock-id/mock-back-link';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getUploadPlans', () => {
    it('should call the correct template', () => {
      const req = mockReq();
      const res = mockRes();

      req.session.backLink = backLinkUrl;
      uploadPlansController.getUploadPlans(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: backLinkUrl,
        uploadedFiles: [],
      });
    });

    it('it should have the correct back link when no request session object exists.', () => {
      const req = mockReq();
      const res = mockRes();

      uploadPlansController.getUploadPlans(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        uploadedFiles: [],
      });
    });
  });

  describe('postUploadPlans', () => {
    [
      {
        title: 'should delete a document from temporary files if delete is passed',
        given: () => ({
          ...mockReq(),
          body: {
            delete: 'some-file',
          },
          session: {
            uploadedFiles: [{ name: 'some-file' }, { name: 'another-file' }],
          },
        }),
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([{ name: 'another-file' }]);
          expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
            appeal: null,
            backLink: '/mock-id/task-list',
            ...fileUploadNunjucksVariables(undefined, [], req.session?.uploadedFiles),
          });
        },
      },
      {
        title: 'ignores an invalid delete id is passed',
        given: () => ({
          ...mockReq(),
          body: {
            delete: 'different-file',
          },
          session: {
            uploadedFiles: [{ name: 'some-file' }, { name: 'another-file' }],
          },
        }),
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([
            { name: 'some-file' },
            { name: 'another-file' },
          ]);
          expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
            appeal: null,
            backLink: '/mock-id/task-list',
            ...fileUploadNunjucksVariables(undefined, [], req.session?.uploadedFiles),
          });
        },
      },
      {
        title: 'should handle files that are invalid and reload page showing errors',
        given: () => ({
          ...mockReq(),
          body: {
            errors: {
              'files.documents[0]': {
                msg: 'some error',
              },
            },
            files: {
              documents: [
                {
                  name: 'some-file',
                },
              ],
            },
          },
        }),
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([{ name: 'some-file', error: 'some error' }]);
          expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
            appeal: null,
            backLink: '/mock-id/task-list',
            ...fileUploadNunjucksVariables(
              undefined,
              fileErrorSummary(undefined, req),
              req.session?.uploadedFiles
            ),
          });
        },
      },
      {
        title:
          'should pass uploaded files to temporary files if submit not clicked and reload page',
        given: () => ({
          ...mockReq(),
          body: {
            files: {
              documents: [
                {
                  name: 'some-file',
                },
              ],
            },
          },
        }),
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([{ name: 'some-file' }]);
          expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
            appeal: null,
            backLink: '/mock-id/task-list',
            ...fileUploadNunjucksVariables(undefined, [], req.session?.uploadedFiles),
          });
        },
      },
      {
        title: 'should reload page with errors if submit clicked but no documents found',
        given: () => ({
          ...mockReq(),
          body: {
            errors: {
              documents: { msg: 'some error' },
            },
            submit: 'save',
          },
        }),
        expected: (req, res) => {
          expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
            appeal: null,
            backLink: '/mock-id/task-list',
            ...fileUploadNunjucksVariables('some error', fileErrorSummary('some error', req)),
          });
        },
      },
      {
        title: 'should reload page with errors if the uploadedFiles store holds errors',
        given: () => ({
          ...mockReq(),
          body: {
            submit: 'save',
          },
          session: {
            uploadedFiles: [{ name: 'some-file', error: 'some error' }, { name: 'another-file' }],
          },
        }),
        expected: (req, res) => {
          expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
            appeal: null,
            backLink: '/mock-id/task-list',
            ...fileUploadNunjucksVariables(
              undefined,
              fileErrorSummary(undefined, req),
              req.session?.uploadedFiles
            ),
          });
        },
      },
      {
        title: 'should redirect if valid files are uploaded',
        given: () => ({
          ...mockReq(),
          body: {
            submit: 'save',
          },
          session: {
            uploadedFiles: [{ name: 'some-file' }, { name: 'another-file' }],
          },
        }),
        expected: (req, res) => {
          expect(res.redirect).toHaveBeenCalledWith('/mock-id/task-list');
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(title, async () => {
        const req = given();
        const res = mockRes();

        await uploadPlansController.postUploadPlans(req, res);

        expected(req, res);
      });
    });
  });
});
