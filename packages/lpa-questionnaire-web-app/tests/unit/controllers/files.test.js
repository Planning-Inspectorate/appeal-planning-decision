const filesController = require('../../../src/controllers/files');
const { uploadFiles } = require('../../../src/lib/file-upload-helpers');
const { deleteDocument } = require('../../../src/lib/documents-api-wrapper');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/file-upload-helpers');
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
          },
        }),
        expected: (_, res) => {
          expect(res.json).toHaveBeenCalledWith({
            error: {
              message: 'some error',
            },
            file: {
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
        uploadResponse: () => [{ id: 'mock-id', name: 'mock-file' }],
        expected: (_, res) => {
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            success: {
              messageHtml: 'mock-file',
            },
            file: {
              filename: 'mock-id',
              id: 'mock-id',
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
        title: 'should return 404 if deleteDocument returns an error',
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
          expect(deleteDocument).toHaveBeenCalledWith(null, 'mock-file');
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
        }),
        expected: (req, res) => {
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            id: 'mock-file',
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
