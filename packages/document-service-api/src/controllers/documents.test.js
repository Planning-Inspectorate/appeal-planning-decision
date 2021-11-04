const { documentTypes } = require('@pins/common');
const {
  getDocumentsForApplication,
  getDocumentById,
  serveDocumentById,
  uploadDocument,
  deleteDocument,
} = require('./documents');
const BlobStorage = require('../lib/blobStorage');
const deleteLocalFile = require('../lib/deleteLocalFile');
const { mockReq, mockRes } = require('../../test/utils/mocks');

const containerClient = () => 'mock-container-client';
const uploadDate = new Date().toISOString();
const applicationId = 'be046963-6cdd-4958-bd58-11be56304329';
const documentId = '72c188c7-d034-48a9-b712-c94a1c571f9d';
const fileOne = {
  metadata: {
    name: 'document-one.pdf',
    location: `${applicationId}/${documentId}/document-one.pdf`,
    mime_type: 'application/pdf',
    size: 1000,
  },
};
const fileTwo = {
  metadata: {
    name: 'document-two.pdf',
    location: `${applicationId}/${documentId}/document-two.pdf`,
    mime_type: 'application/pdf',
    size: 2000,
  },
};
const multipleFilesReturnValue = [fileOne, fileTwo];
const singleFileReturnValue = fileOne;
const uploadedFileReturnValue = {
  application_id: applicationId,
  name: fileOne.metadata.name,
  upload_date: uploadDate,
  mime_type: fileOne.metadata.mime_type,
  location: `${applicationId}/${documentId}/${fileOne.metadata.name}`,
  size: String(fileOne.metadata.size),
  id: documentId,
  document_type: documentTypes.appealPdf.name,
};

jest.mock('../lib/blobStorage', () => ({
  initContainerClient: containerClient,
  getMetadataForAllFiles: jest.fn(),
  getMetadataForSingleFile: jest.fn(),
  downloadFile: jest.fn(),
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
}));

jest.mock('../lib/deleteLocalFile');

describe('controllers/documents', () => {
  const res = mockRes();

  let req;

  beforeEach(() => {
    req = {
      ...mockReq,
      query: {
        base64: 'false',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocumentsForApplication', () => {
    it('should return documents when given a valid application id', async () => {
      req.params.applicationId = applicationId;

      BlobStorage.getMetadataForAllFiles.mockReturnValue(multipleFilesReturnValue);

      await getDocumentsForApplication(req, res);

      expect(BlobStorage.getMetadataForAllFiles).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForAllFiles).toBeCalledWith(containerClient(), applicationId);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(multipleFilesReturnValue);
    });

    it('should return an error when given an invalid application id', async () => {
      req.params.applicationId = undefined;

      BlobStorage.getMetadataForAllFiles.mockReturnValue([]);

      await getDocumentsForApplication(req, res);

      expect(BlobStorage.getMetadataForAllFiles).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForAllFiles).toBeCalledWith(containerClient(), undefined);
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Invalid application id',
      });
    });

    it('should return an error when an error is thrown getting all documents', async () => {
      BlobStorage.getMetadataForAllFiles.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      await getDocumentsForApplication(req, res);

      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('getDocumentById', () => {
    it('should return a document when given a valid application and document id', async () => {
      req.params.applicationId = applicationId;
      req.params.documentId = documentId;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);

      await getDocumentById(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        applicationId,
        documentId
      );
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(singleFileReturnValue);
    });

    it('should return an error when given an invalid application id', async () => {
      req.params.applicationId = undefined;
      req.params.documentId = documentId;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(null);

      await getDocumentById(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        undefined,
        documentId
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Invalid application or document id',
      });
    });

    it('should return an error when given an invalid document id', async () => {
      req.params.applicationId = applicationId;
      req.params.documentId = undefined;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(null);

      await getDocumentById(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        applicationId,
        undefined
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Invalid application or document id',
      });
    });

    it('should return an error when an error is thrown getting the document', async () => {
      BlobStorage.getMetadataForSingleFile.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      await getDocumentById(req, res);

      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('serveDocumentById', () => {
    it('should return a document when given a valid application and document id', async () => {
      const fileBuffer = 'file-buffer';

      req.params.applicationId = applicationId;
      req.params.documentId = documentId;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);
      BlobStorage.downloadFile.mockReturnValue(fileBuffer);

      await serveDocumentById(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        applicationId,
        documentId
      );
      expect(BlobStorage.downloadFile).toBeCalledTimes(1);
      expect(BlobStorage.downloadFile).toBeCalledWith(
        containerClient(),
        singleFileReturnValue.metadata.location
      );
      expect(res.set).toBeCalledTimes(2);
      expect(res.set).toBeCalledWith('content-type', fileOne.metadata.mime_type);
      expect(res.set).toBeCalledWith('x-original-file-name', fileOne.metadata.name);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(fileBuffer);
    });

    it('should return a document in base64 when given a valid application and document id and base64 flag is true', async () => {
      const fileBuffer = 'file-buffer';
      const base64FileBuffer = fileBuffer.toString('base64');

      req.params.applicationId = applicationId;
      req.params.documentId = documentId;
      req.query.base64 = 'true';

      BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);
      BlobStorage.downloadFile.mockReturnValue(fileBuffer);

      await serveDocumentById(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        applicationId,
        documentId
      );
      expect(BlobStorage.downloadFile).toBeCalledTimes(1);
      expect(BlobStorage.downloadFile).toBeCalledWith(
        containerClient(),
        singleFileReturnValue.metadata.location
      );
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        ...singleFileReturnValue.metadata,
        dataSize: base64FileBuffer.length,
        data: base64FileBuffer,
      });
    });

    it('should return an error when no metadata is returned for the given document', async () => {
      req.params.applicationId = applicationId;
      req.params.documentId = documentId;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(null);

      await serveDocumentById(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        applicationId,
        documentId
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Invalid application or document id',
      });
    });

    it('should return an error when an error is thrown getting the document', async () => {
      BlobStorage.getMetadataForSingleFile.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      await serveDocumentById(req, res);

      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('uploadDocument', () => {
    beforeEach(() => {
      req.body = {
        documentType: documentTypes.appealPdf.name,
      };
    });

    it('should return the metadata when a file is uploaded successfully', async () => {
      req.file = {
        mimetype: fileOne.metadata.mime_type,
        originalname: fileOne.metadata.name,
        filename: fileOne.metadata.name,
        size: 1000,
        id: documentId,
        uploadDate,
      };
      req.params.applicationId = applicationId;

      BlobStorage.uploadFile.mockReturnValue(uploadedFileReturnValue);

      await uploadDocument(req, res);

      expect(BlobStorage.uploadFile).toBeCalledTimes(1);
      expect(BlobStorage.uploadFile).toBeCalledWith(containerClient(), {
        ...uploadedFileReturnValue,
        filename: req.file.filename,
      });
      expect(deleteLocalFile).toBeCalledTimes(1);
      expect(deleteLocalFile).toBeCalledWith(req.file);
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(202);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(uploadedFileReturnValue);
    });

    it('should return an error when an error is thrown uploading the document', async () => {
      BlobStorage.uploadFile.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      await uploadDocument(req, res);

      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('deleteDocument', () => {
    it('should return the correct status when a document is deleted successfully', async () => {
      req.params.applicationId = applicationId;
      req.params.documentId = documentId;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);
      BlobStorage.deleteFile.mockReturnValue(true);

      await deleteDocument(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        applicationId,
        documentId
      );
      expect(BlobStorage.deleteFile).toBeCalledTimes(1);
      expect(BlobStorage.deleteFile).toBeCalledWith(
        containerClient(),
        singleFileReturnValue.metadata.location
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(204);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith();
    });

    it('should return an error when no metadata is returned for the given document', async () => {
      req.params.applicationId = undefined;
      req.params.documentId = documentId;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(null);

      await deleteDocument(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        undefined,
        documentId
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Invalid application or document id',
      });
    });

    it('should return an error when the document is not deleted', async () => {
      req.params.applicationId = applicationId;
      req.params.documentId = documentId;

      BlobStorage.getMetadataForSingleFile.mockReturnValue(singleFileReturnValue);
      BlobStorage.deleteFile.mockReturnValue(false);

      await deleteDocument(req, res);

      expect(BlobStorage.getMetadataForSingleFile).toBeCalledTimes(1);
      expect(BlobStorage.getMetadataForSingleFile).toBeCalledWith(
        containerClient(),
        applicationId,
        documentId
      );
      expect(BlobStorage.deleteFile).toBeCalledTimes(1);
      expect(BlobStorage.deleteFile).toBeCalledWith(
        containerClient(),
        singleFileReturnValue.metadata.location
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Failed to delete document',
      });
    });

    it('should return an error when an error is thrown deleting the document', async () => {
      BlobStorage.getMetadataForSingleFile.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      await deleteDocument(req, res);

      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith({
        message: 'Internal Server Error',
      });
    });
  });
});
