const filesController = require('../../../src/controllers/files');
const { deleteDocument } = require('../../../src/lib/documents-api-wrapper');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/logger');
jest.mock('../../../src/lib/documents-api-wrapper');

describe('controllers/files', () => {
  describe('uploadFile', () => {
    [
      {
        title: 'should return status 500 if no files provided',
        given: () => ({
          ...mockReq(),
          body: {},
        }),
        expected: (_, res) => {
          expect(res.status).toHaveBeenCalledWith(500);
        },
      },
      {
        title: 'should return status 500 if no files provided with wrong name',
        given: () => ({
          ...mockReq(),
          body: {
            'mock-name': [],
          },
        }),
        expected: (_, res) => {
          expect(res.status).toHaveBeenCalledWith(500);
        },
      },
      {
        title: 'should return error if validator fails',
        given: () => ({
          ...mockReq(),
          body: {
            files: {
              documents: [
                {
                  name: 'mock-file',
                },
              ],
            },
            errors: {
              'files.documents[0]': {
                msg: 'some error',
              },
            },
            errorSummary: [
              {
                text: 'some error',
                url: '#mock-url',
              },
            ],
          },
        }),
        expected: (_, res) => {
          expect(res.json).toHaveBeenCalledWith({
            error: {
              message: 'some error',
              summary: [
                {
                  text: 'some error',
                  url: '#documents',
                },
              ],
            },
            file: {
              filename: 'mock-file',
              originalname: 'mock-file',
            },
          });
        },
      },
      {
        title: 'should add file to uploaded files if all valid',
        given: () => ({
          ...mockReq(),
          body: {
            files: {
              documents: [
                {
                  name: 'mock-file',
                },
              ],
            },
          },
        }),
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([{ name: 'mock-file' }]);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            success: {
              messageText: 'mock-file',
              messageHtml: 'mock-file',
            },
            file: {
              filename: 'mock-file',
              originalname: 'mock-file',
            },
          });
        },
      },
      {
        title: 'should append doc if valid and other documents exist',
        given: () => ({
          ...mockReq(),
          body: {
            files: {
              documents: [{ name: 'mock-file' }],
            },
          },
          session: {
            uploadedFiles: [{ name: 'another-file' }],
          },
        }),
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([
            { name: 'another-file' },
            { name: 'mock-file' },
          ]);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            success: {
              messageText: 'mock-file',
              messageHtml: 'mock-file',
            },
            file: {
              filename: 'mock-file',
              originalname: 'mock-file',
            },
          });
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(title, async () => {
        const req = given();
        const res = mockRes();

        await filesController.uploadFile(req, res);

        expected(req, res);
      });
    });
  });

  describe('deleteFile', () => {
    [
      {
        title: 'should return status 500 if no session found',
        given: () => ({
          ...mockReq(),
          session: null,
        }),
        expected: (_, res) => {
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.send).toHaveBeenCalledWith('No session data found');
        },
      },
      {
        title: 'should return status 400 if no delete ID provided',
        given: () => ({
          ...mockReq(),
          body: {},
        }),
        expected: (_, res) => {
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.send).toHaveBeenCalledWith('Delete required');
        },
      },
      {
        title: 'should call delete service if not in uploadedFiles and if successful, return 200',
        given: () => ({
          ...mockReq(),
          body: {
            delete: 'mock-file',
          },
        }),
        deleteMock: () => 'ok',
        expected: (req, res) => {
          expect(deleteDocument).toHaveBeenCalledWith('mock-file');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            success: {
              messageText: 'mock-file deleted',
            },
          });
        },
      },
      {
        title: 'should call delete service if not in uploadedFiles and and if error, return 404',
        given: () => ({
          ...mockReq(),
          body: {
            delete: 'mock-file',
          },
        }),
        deleteMock: () => {
          throw new Error('Not found');
        },
        expected: (req, res) => {
          expect(deleteDocument).toHaveBeenCalledWith('mock-file');
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.send).toHaveBeenCalledWith('File not found');
        },
      },
      {
        title: 'should return status 200 and remove file if file is in uploaded files',
        given: () => ({
          ...mockReq(),
          body: {
            delete: 'mock-file',
          },
          session: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        }),
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([]);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            success: {
              messageText: 'mock-file deleted',
            },
          });
        },
      },
    ].forEach(({ title, given, expected, deleteMock }) => {
      it(title, async () => {
        const req = given();
        const res = mockRes();

        deleteDocument.mockImplementation(deleteMock || (() => {}));

        await filesController.deleteFile(req, res);

        expected(req, res);
      });
    });
  });
});
