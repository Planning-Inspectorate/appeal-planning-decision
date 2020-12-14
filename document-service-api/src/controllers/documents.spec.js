jest.mock('multer');
jest.mock('../schemas/documents');

const multer = require('multer');
const controller = require('./documents');
const Documents = require('../schemas/documents');
const config = require('../lib/config');

describe('Documents controller', () => {
  let res = {};
  beforeEach(() => {
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    res.status.mockReturnValue(res);
  });

  describe('#getDocsForApplication', () => {
    it('should return an empty array if zero documents', async () => {
      const applicationId = 'some-app-id';
      const req = {
        log: {
          debug: jest.fn(),
        },
        params: {
          applicationId,
        },
      };

      Documents.find.mockResolvedValue([]);

      expect(await controller.getDocsForApplication(req, res)).toBe(undefined);

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({
        message: 'Unknown application ID',
      });

      expect(Documents.find).toBeCalledWith({
        applicationId,
      });
    });

    it('should return the mapped DTOs if documents found', async () => {
      const applicationId = 'some-app-id2';
      const req = {
        params: {
          applicationId,
        },
      };

      const mockedValue = [
        {
          toDTO: () => 'dto1',
        },
        {
          toDTO: () => 'dto2',
        },
      ];

      Documents.find.mockResolvedValue(mockedValue);

      expect(await controller.getDocsForApplication(req, res)).toBe(undefined);

      expect(res.send).toBeCalledWith(mockedValue.map((item) => item.toDTO()));
    });
  });

  describe('#getDocumentById', () => {
    it('should return a 404 error if no document found', async () => {
      const applicationId = 'some-app-id';
      const documentId = 'some-doc-id';
      const req = {
        log: {
          debug: jest.fn(),
        },
        params: {
          applicationId,
          documentId,
        },
      };

      Documents.findOne.mockResolvedValue(null);

      expect(await controller.getDocumentById(req, res)).toBe(undefined);

      expect(Documents.findOne).toBeCalledWith({
        applicationId,
        id: documentId,
      });

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({
        message: 'Unknown document ID',
      });
    });

    it('should return the document if found', async () => {
      const applicationId = 'some-app-id2';
      const documentId = 'some-doc-id2';
      const doc = 'some-doc-obj';
      const req = {
        params: {
          applicationId,
          documentId,
        },
      };

      Documents.findOne.mockResolvedValue(doc);

      expect(await controller.getDocumentById(req, res)).toBe(undefined);

      expect(Documents.findOne).toBeCalledWith({
        applicationId,
        id: documentId,
      });

      expect(res.send).toBeCalledWith(doc);
    });
  });

  describe('#uploadDocument', () => {
    describe('multer middleware', () => {
      let multerClosure;
      let multerRes;
      let req;
      beforeEach(() => {
        req = {
          log: {
            warn: jest.fn(),
          },
        };
        multerClosure = jest.fn();
        multerRes = {
          single: jest.fn().mockReturnValue(multerClosure),
        };
        multer.mockReturnValue(multerRes);
        multer.diskStorage.mockReturnValue('diskStorageConfig');
      });

      afterEach(() => {
        expect(multer).toBeCalledWith({
          limits: {
            fileSize: config.fileUpload.maxSizeInBytes,
          },
          storage: 'diskStorageConfig',
        });

        expect(
          multer.diskStorage({
            destination: config.fileUpload.path,
          })
        );

        expect(multerRes.single).toBeCalledWith('file');
      });

      it('should return a LIMIT_FILE_SIZE as a 422 error', () => {
        multerClosure.mockImplementation((request, response, next) => {
          expect(request).toBe(req);
          expect(response).toBe(res);
          next({
            code: 'LIMIT_FILE_SIZE',
          });
        });

        expect(controller.uploadDocument[0](req, res)).toBe(undefined);

        expect(res.status).toBeCalledWith(422);
        expect(res.send).toBeCalledWith({
          message: 'File too large',
          maxSize: config.fileUpload.maxSizeInBytes,
        });
      });

      it('should trigger a next error if a multer error', (cb) => {
        const err = 'some-error';
        multerClosure.mockImplementation((request, response, next) => {
          expect(request).toBe(req);
          expect(response).toBe(res);
          next(err);
        });

        controller.uploadDocument[0](req, res, (error) => {
          expect(error).toBe(err);
          cb();
        });
      });

      it('should return next if no error', (cb) => {
        multerClosure.mockImplementation((request, response, next) => {
          expect(request).toBe(req);
          expect(response).toBe(res);
          next();
        });

        controller.uploadDocument[0](req, res, cb);
      });
    });

    describe('upload middleware', () => {
      it('should return error if no file uploaded', async () => {
        const req = {
          file: null,
          params: {},
          log: {
            debug: jest.fn(),
            info: jest.fn(),
          },
        };

        expect(await controller.uploadDocument[1](req, res)).toBe(undefined);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith({
          message: 'No file uploaded',
        });
      });

      it('should return error if invalid mime type uploaded', async () => {
        const req = {
          file: {
            mimetype: 'some-mime-type',
          },
          params: {},
          log: {
            debug: jest.fn(),
            info: jest.fn(),
          },
        };

        expect(await controller.uploadDocument[1](req, res)).toBe(undefined);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith({
          message: 'Invalid mime type',
          mimeType: req.file.mimetype,
          allowed: config.fileUpload.mimeTypes,
        });
      });

      it('should return error if Document fails validation', async () => {
        const req = {
          file: {
            mimetype: 'application/pdf',
          },
          params: {},
          log: {
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
          },
        };

        const err = 'some-err';

        const doc = {
          generateId: jest.fn(),
          generateLocation: jest.fn(),
          validate: jest.fn().mockRejectedValue(err),
        };
        doc.generateId.mockReturnValue(doc);

        Documents.mockReturnValue(doc);

        expect(await controller.uploadDocument[1](req, res)).toBe(undefined);

        expect(doc.validate).toBeCalled();

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(err);
      });

      it('should save document and return a 202 response with DTO', async () => {
        const req = {
          file: {
            mimetype: 'application/pdf',
          },
          params: {},
          log: {
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
          },
        };

        const dtoValue = 'some-dto';

        const doc = {
          generateId: jest.fn(),
          generateLocation: jest.fn(),
          save: jest.fn().mockResolvedValue(),
          toDTO: jest.fn().mockReturnValue(dtoValue),
          validate: jest.fn().mockResolvedValue(),
        };
        doc.generateId.mockReturnValue(doc);

        Documents.mockReturnValue(doc);

        expect(await controller.uploadDocument[1](req, res)).toBe(undefined);

        expect(doc.validate).toBeCalled();
        expect(doc.save).toBeCalled();
        expect(res.status).toBeCalledWith(202);
        expect(res.send).toBeCalledWith(dtoValue);
      });
    });
  });
});
