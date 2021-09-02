jest.mock('../../../src/lib/blobStorage');
jest.mock('../../../src/schemas/documents');

const { when } = require('jest-when');
const Documents = require('../../../src/schemas/documents');
const { connectToBlobStorage } = require('../../../src/lib/blobStorage');

const { uploadToBlobStorage, deleteFromBlobStorage } = require('../../../src/lib/blobStorage');
const {
  uploadDocumentsToBlobStorage,
  deleteFromBlobStorageByLocation,
} = require('../../../src/services/upload.service');

describe('services', () => {
  const originalDoc = {
    applicationId: 'afb67bfb-04c8-4dd8-94af-9ce70c3404ea',
    upload: {
      processed: false,
      processAttempts: 0,
    },
    name: 'appeal-statement-valid.pdf',
    mimeType: 'application/pdf',
    location: '8fd8700839ada952f02c9d91577ce85a',
    size: 22528,
    id: 'ce90ff09-e56b-4741-97a5-dea4df1abd3c',
  };

  let document;

  describe('deleteFromBlobStorageByLocation', () => {
    it('should call the appropriate method on the blob storage', async () => {
      deleteFromBlobStorage.mockReturnValue({ some: 'response' });
      expect(await deleteFromBlobStorageByLocation([document])).toEqual({ some: 'response' });
    });
  });

  describe('uploadDocumentsToBlobStorage', () => {
    beforeEach(() => {
      connectToBlobStorage.mockReturnValue({
        containerClient: {},
      });

      when(Documents.findOneAndUpdate)
        .calledWith(expect.anything(), {
          $inc: {
            'upload.processAttempts': 1,
          },
        })
        .mockImplementation(() => {
          document.upload.processAttempts += 1;
          return [document];
        });

      when(Documents.findOneAndUpdate)
        .calledWith(
          expect.anything(),
          {
            'upload.processed': true,
          },
          {
            new: true,
          }
        )
        .mockImplementation(() => {
          document.upload.processed = true;
          return [document];
        });

      when(Documents.findOneAndUpdate)
        .calledWith(
          expect.anything(),
          {
            'upload.processed': false,
          },
          {
            new: true,
          }
        )
        .mockImplementation(() => {
          document.upload.processed = false;
          return [document];
        });

      document = JSON.parse(JSON.stringify(originalDoc));
    });

    it('should upload the document successfully', async () => {
      uploadToBlobStorage.mockImplementation(() => {
        return () => {
          return [
            {
              uploaded: true,
              doc: document,
            },
          ];
        };
      });

      const result = await uploadDocumentsToBlobStorage([document]);
      expect(result[0][0].upload.processAttempts).toBe(1);
      expect(result[0][0].upload.processed).toBe(true);
    });

    it('should not upload the document successfully - blob storage client failed', async () => {
      uploadToBlobStorage.mockImplementation(() => {
        return () => {
          return [
            {
              uploaded: false,
              doc: document,
            },
          ];
        };
      });

      const result = await uploadDocumentsToBlobStorage([document]);
      expect(result[0][0].doc.upload.processAttempts).toBe(1);
      expect(result[0][0].doc.upload.processed).toBe(false);
    });

    it('should not upload the document fully successfully - process number increase failed', async () => {
      when(Documents.findOneAndUpdate)
        .calledWith(expect.anything(), {
          $inc: {
            'upload.processAttempts': 1,
          },
        })
        .mockImplementation(() =>
          Promise.reject(new Error('Error incrementing a process attempt'))
        );

      uploadToBlobStorage.mockImplementation(() => {
        return () => {
          return [
            {
              uploaded: true,
              doc: document,
            },
          ];
        };
      });

      const result = await uploadDocumentsToBlobStorage([document]);
      expect(result[0][0].upload.processAttempts).toBe(0);
      expect(result[0][0].upload.processed).toBe(true);
    });

    it('should not upload the document fully successfully - upload status update failed', async () => {
      when(Documents.findOneAndUpdate)
        .calledWith(
          expect.anything(),
          {
            'upload.processed': true,
          },
          {
            new: true,
          }
        )
        .mockImplementation(() => Promise.reject(new Error('Error updating document status')));

      uploadToBlobStorage.mockImplementation(() => {
        return () => {
          return [
            {
              uploaded: true,
              doc: document,
            },
          ];
        };
      });

      const result = await uploadDocumentsToBlobStorage([document]);
      expect(result[0][0].doc.upload.processAttempts).toBe(1);
      expect(result[0][0].doc.upload.processed).toBe(false);
    });
  });
});
