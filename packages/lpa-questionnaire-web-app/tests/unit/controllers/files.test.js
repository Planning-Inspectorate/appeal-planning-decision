const filesController = require('../../../src/controllers/files');
const { deleteFile, uploadFiles } = require('../../../src/lib/file-upload-helpers');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/file-upload-helpers');

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
          },
        }),
        expected: (_, res) => {
          expect(res.json).toHaveBeenCalledWith({
            error: {
              message: 'some error',
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
        uploadResponse: () => [{ name: 'mock-file' }],
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([{ name: 'mock-file' }]);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            success: {
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
        uploadResponse: () => [{ name: 'mock-file' }],
        expected: (req, res) => {
          expect(req.session.uploadedFiles).toEqual([
            { name: 'another-file' },
            { name: 'mock-file' },
          ]);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            success: {
              messageHtml: 'mock-file',
            },
            file: {
              filename: 'mock-file',
              originalname: 'mock-file',
            },
          });
        },
      },
    ].forEach(({ title, given, expected, uploadResponse = () => {} }) => {
      it(title, async () => {
        const req = given();
        const res = mockRes();

        uploadFiles.mockImplementation(uploadResponse);

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
        title: 'should return 404 if deleteFile returns an error',
        given: () => ({
          ...mockReq(),
          body: {
            delete: 'mock-file',
          },
        }),
        deleteMock: () => {
          throw new Error('something happened');
        },
        expected: (req, res) => {
          expect(deleteFile).toHaveBeenCalledWith('mock-file', req);
          expect(res.status).toHaveBeenCalledWith(404);
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

        deleteFile.mockImplementation(deleteMock || (() => {}));

        await filesController.deleteFile(req, res);

        expected(req, res);
      });
    });
  });
});
