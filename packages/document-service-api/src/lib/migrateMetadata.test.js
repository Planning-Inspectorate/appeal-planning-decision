const { getDocuments, mapMetadata, saveMetadata, migrateMetadata } = require('./migrateMetadata');
const Documents = require('../schemas/documents');
const blobStorage = require('./blobStorage');

const documentOne = {
  applicationId: '467637a5-e2e5-4dc3-a560-6ff37556c0bd',
  name: 'test-pdf-1.pdf',
  uploadDate: '2021-09-03T15:52:00.000Z',
  id: '9b631265-3d50-4496-82fe-67431f689243',
  size: 1000,
  mimeType: 'application/pdf',
};
const documentTwo = {
  applicationId: '467637a5-e2e5-4dc3-a560-6ff37556c0bd',
  name: 'test-pdf-2.pdf',
  uploadDate: '2021-09-03T16:00:00.000Z',
  id: '5fe7f93c-0976-4f52-b674-2826e11bd98f',
  size: 2000,
  mimeType: 'application/pdf',
};
const documentWithoutUploadDate = {
  applicationId: '567637a5-e2e5-4dc3-a560-6ff37556c0bd',
  name: 'test-pdf-3.pdf',
  id: '6fe7f93c-0976-4f52-b674-2826e11bd98f',
  size: 1000,
  mimeType: 'application/pdf',
};
const documentOneMetadata = {
  application_id: documentOne.applicationId,
  name: documentOne.name,
  upload_date: documentOne.uploadDate,
  mime_type: documentOne.mimeType,
  location: `${documentOne.applicationId}/${documentOne.id}/${documentOne.name}`,
  size: String(documentOne.size),
  id: documentOne.id,
};
const documentTwoMetadata = {
  application_id: documentTwo.applicationId,
  name: documentTwo.name,
  upload_date: documentTwo.uploadDate,
  mime_type: documentTwo.mimeType,
  location: `${documentTwo.applicationId}/${documentTwo.id}/${documentTwo.name}`,
  size: String(documentTwo.size),
  id: documentTwo.id,
};
const documents = [documentOne, documentTwo, documentWithoutUploadDate];

jest.mock('../schemas/documents', () => ({
  find: jest.fn(),
}));

jest.mock('./blobStorage', () => ({
  initContainerClient: jest.fn(),
  saveMetadata: jest.fn(),
}));

describe('lib/migrateMetadata', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocuments', () => {
    it('should return the documents from Cosmos DB', () => {
      Documents.find.mockReturnValue(documents);

      const result = getDocuments();

      expect(result).toEqual(documents);
    });
  });

  describe('mapMetadata', () => {
    it('should return metadata formatted for Blob Storage when given metadata from Cosmos DB', () => {
      const result = mapMetadata(documentOne);

      expect(result).toEqual({
        application_id: documentOne.applicationId,
        name: documentOne.name,
        upload_date: documentOne.uploadDate,
        mime_type: documentOne.mimeType,
        location: `${documentOne.applicationId}/${documentOne.id}/${documentOne.name}`,
        size: String(documentOne.size),
        id: documentOne.id,
      });
    });
  });

  describe('saveMetadata', () => {
    it('should return true when the metadata is saved successfully', async () => {
      blobStorage.saveMetadata.mockReturnValue(true);

      const result = await saveMetadata(documentOneMetadata);

      expect(result).toBeTruthy();
    });

    it('should throw an error when an error occurs', async () => {
      blobStorage.saveMetadata.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await saveMetadata(documentOneMetadata);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });

  describe('migrateMetadata', () => {
    it('should return a summary of the migrated/failed documents when the migration completed', async () => {
      Documents.find.mockReturnValue(documents);
      blobStorage.saveMetadata.mockReturnValue(true);

      const result = await migrateMetadata();

      expect(result).toMatchObject({
        documentsFound: 3,
        documentsMigrated: 2,
        documentsFailed: 1,
        migratedDocuments: [
          {
            cosmosDbMetadata: documentOne,
            blobStorageMetadata: documentOneMetadata,
          },
          {
            cosmosDbMetadata: documentTwo,
            blobStorageMetadata: documentTwoMetadata,
          },
        ],
        failedDocuments: [
          {
            documentId: documentWithoutUploadDate.id,
            message: expect.any(String),
          },
        ],
      });
    });

    it('should throw an error when an error occurs', async () => {
      Documents.find.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await migrateMetadata();
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });
});
