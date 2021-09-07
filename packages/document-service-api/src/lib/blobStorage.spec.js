const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
const {
  initContainerClient,
  downloadFile,
  uploadFile,
  deleteFile,
  getMetadataForAllFiles,
  getMetadataForSingleFile,
  saveMetadata,
} = require('./blobStorage');

const document = {
  filename: path.join(__dirname, './config.js'),
};
const applicationId = 'eb3bf079-328c-4a9c-bbcb-07432118cd02';
const documentIdOne = 'c414f732-eecb-489b-9a94-2932d4c074a1';
const documentIdTwo = '3430cbee-2fdc-49b8-873c-6eaa3ef7c2f3';
const documentIdThree = '4377cc1a-71a1-4f56-b65f-cb3f74d10631';
const fileOne = {
  metadata: {
    name: 'test-pdf-1.pdf',
    id: documentIdOne,
  },
};
const fileTwo = {
  metadata: {
    name: 'test-pdf-2.pdf',
    id: documentIdTwo,
  },
};
const multipleFilesReturnValue = [fileOne, fileTwo];
const mockGetContainerClient = {
  createIfNotExists: () => true,
};

let containerClient;

jest.mock('./config', () => ({
  fileUpload: {
    path: '',
  },
  logger: {
    level: 'info',
  },
  storage: {
    connectionString: '',
    container: '',
  },
}));

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: () => ({
      getContainerClient: () => mockGetContainerClient,
    }),
  },
}));

describe('lib/blobStorage', () => {
  beforeEach(() => {
    containerClient = {
      getBlobClient: () => ({
        downloadToBuffer: () => true,
        setMetadata: () => true,
      }),
      getBlockBlobClient: () => ({
        uploadStream: jest.fn(),
        delete: () => true,
      }),
      listBlobsFlat: jest.fn().mockReturnValue(multipleFilesReturnValue),
    };
  });

  describe('initContainerClient', () => {
    it('should return containerClient when the connection is initialised successfully', async () => {
      const result = await initContainerClient();

      expect(result).toStrictEqual(mockGetContainerClient);
    });

    it('should throw an error when an error occurs', async () => {
      BlobServiceClient.fromConnectionString = jest.fn().mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await initContainerClient();
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });

  describe('downloadFile', () => {
    it('should return the file when the file is downloaded successfully', async () => {
      const file = await downloadFile(containerClient, document);

      expect(file).toBeTruthy();
    });

    it('should throw an error when an error occurs', async () => {
      containerClient.getBlobClient = jest.fn().mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await downloadFile(containerClient, document);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });

  describe('uploadFile', () => {
    it('should return the metadata when the file is uploaded successfully', async () => {
      const result = await uploadFile(containerClient, document);

      const metadata = { ...document };
      delete metadata.filename;

      expect(result).toEqual(metadata);
    });

    it('should throw an error when an error occurs', async () => {
      containerClient.getBlockBlobClient = jest.fn().mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await uploadFile(containerClient, document);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });

  describe('deleteFile', () => {
    const location = '';

    it('should return true when the file is deleted successfully', async () => {
      const result = await deleteFile(containerClient, location);

      expect(result).toBeTruthy();
    });

    it('should throw an error when an error occurs', async () => {
      containerClient.getBlockBlobClient = jest.fn().mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await deleteFile(containerClient, location);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });

  describe('getMetadataForAllFiles', () => {
    it('should return an array of metadata when the metadata is fetched successfully', async () => {
      const result = await getMetadataForAllFiles(containerClient, applicationId);

      expect(result).toEqual(multipleFilesReturnValue);
    });

    it('should throw an error when an error occurs', async () => {
      containerClient.listBlobsFlat = jest.fn().mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await getMetadataForAllFiles(containerClient, applicationId);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });

  describe('getMetadataForSingleFile', () => {
    it('should return the metadata when the metadata is fetched successfully', async () => {
      const result = await getMetadataForSingleFile(containerClient, applicationId, documentIdTwo);

      expect(result).toEqual(fileTwo);
    });

    it('should return null when the metadata cannot be fetched', async () => {
      const result = await getMetadataForSingleFile(
        containerClient,
        applicationId,
        documentIdThree
      );

      expect(result).toEqual(null);
    });

    it('should return null when the files contain no metadata', async () => {
      containerClient.listBlobsFlat = jest.fn().mockReturnValue([
        {
          name: 'test-pdf-2.pdf',
          id: documentIdTwo,
        },
      ]);

      const result = await getMetadataForSingleFile(
        containerClient,
        applicationId,
        documentIdThree
      );

      expect(result).toEqual(null);
    });

    it('should throw an error when an error occurs', async () => {
      containerClient.listBlobsFlat = jest.fn().mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await getMetadataForSingleFile(containerClient, applicationId);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });

  describe('saveMetadata', () => {
    it('should return true when the metadata is saved successfully', async () => {
      const result = await saveMetadata(containerClient, fileOne);

      expect(result).toBeTruthy();
    });

    it('should throw an error when an error occurs', async () => {
      containerClient.getBlobClient = jest.fn().mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      try {
        await saveMetadata(containerClient, fileOne);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual(
          `Failed to migrate document ${fileOne.id} - Internal Server Error`
        );
      }
    });
  });
});
