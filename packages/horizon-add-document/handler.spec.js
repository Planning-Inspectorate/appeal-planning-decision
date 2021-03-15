jest.mock('axios');
jest.mock('@azure/storage-blob');
process.env.STORAGE_CONTAINER_NAME = 'storage-container-name';
process.env.STORAGE_CONNECTION_STRING_SECRET = 'secret-name-on-disk';
process.env.DOCUMENT_SERVICE_URL = 'document-url';
process.env.HORIZON_URL = 'horizon-url';

const axios = require('axios');
const { BlobServiceClient } = require('@azure/storage-blob');
const handler = require('./handler');

describe('handler', () => {
  const envvars = process.env;
  let context;
  let event;
  let blobDownloader;
  let blobContainerClient;
  let blobServiceClient;

  beforeEach(() => {
    process.env = { ...envvars };

    event = {
      body: {},
      getSecret: jest.fn(),
    };

    context = {
      httpStatus: 200,
    };

    blobDownloader = {
      downloadToBuffer: jest.fn(),
    };

    blobContainerClient = {
      getBlobClient: jest.fn().mockReturnValue(blobDownloader),
    };

    blobServiceClient = {
      getContainerClient: jest.fn().mockReturnValue(blobContainerClient),
    };
  });

  afterEach(() => {
    process.env = envvars;
  });

  it('should download the file from blob storage and push to Horizon', async () => {
    const secretValue = 'some-secret';
    const caseReference = '1234567890';
    const applicationId = 'some-app-id';
    const documentId = 'some-document-id';
    const documentType = 'some-doc-type';
    const docServiceOutput = {
      blobStorageLocation: 'blob-storage-location',
      name: 'some-file-name',
      createdAt: '2021-02-07T12:00:00Z',
    };
    const horizonOutput = {
      some: 'response',
    };
    const blobBuffer = Buffer.from('hello world');

    event.body = {
      caseReference,
      applicationId,
      documentId,
      documentType,
    };

    BlobServiceClient.fromConnectionString.mockReturnValue(blobServiceClient);
    event.getSecret.mockResolvedValue(secretValue);
    blobDownloader.downloadToBuffer.mockResolvedValue(blobBuffer);

    axios.get.mockResolvedValue({
      data: docServiceOutput,
    });

    axios.post.mockResolvedValue({
      data: horizonOutput,
    });

    expect(await handler(event, context)).toEqual({
      caseReference,
      data: horizonOutput,
    });

    expect(BlobServiceClient.fromConnectionString).toBeCalledWith(secretValue);
    expect(event.getSecret).toBeCalledWith(process.env.STORAGE_CONNECTION_STRING_SECRET);
    expect(blobServiceClient.getContainerClient).toBeCalledWith(process.env.STORAGE_CONTAINER_NAME);

    expect(axios.post).toBeCalledWith(
      '/horizon',
      {
        AddDocuments: {
          __soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
          __xmlns: 'http://tempuri.org/',
          caseReference,
          documents: [
            { '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
            { '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
            {
              'a:HorizonAPIDocument': {
                'a:Content': blobBuffer.toString('base64'),
                'a:DocumentType': documentType,
                'a:Filename': docServiceOutput.name,
                'a:IsPublished': 'true',
                'a:Metadata': {
                  'a:Attributes': [
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Document:Involvement',
                        'a:Value': 'Appellant',
                      },
                    },
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Document:Document Group Type',
                        'a:Value': 'Initial Documents',
                      },
                    },
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Document:Incoming/Outgoing/Internal',
                        'a:Value': 'Incoming',
                      },
                    },
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:DateAttributeValue',
                        'a:Name': 'Document:Received/Sent Date',
                        'a:Value': docServiceOutput.createdAt,
                      },
                    },
                  ],
                },
                'a:NodeId': '0',
              },
            },
          ],
        },
      },
      {
        baseURL: process.env.HORIZON_URL,
      }
    );

    /* Horizon must be called in a specific order - not easy to enforce with objects, but best we can do */
    expect(
      Object.keys(axios.post.mock.calls[0][1].AddDocuments.documents[2]['a:HorizonAPIDocument'])
    ).toEqual([
      'a:Content',
      'a:DocumentType',
      'a:Filename',
      'a:IsPublished',
      'a:Metadata',
      'a:NodeId',
    ]);
  });

  it('should handle an error from blob storage', async () => {
    const secretValue = 'some-secret2';
    const caseReference = '1234567891';
    const applicationId = 'some-app-id2';
    const documentId = 'some-document-id2';
    const docServiceOutput = {
      blobStorageLocation: 'blob-storage-location2',
      name: 'some-file-name2',
      createdAt: '2021-02-08T12:00:00Z',
    };
    const blobError = new Error('some-error');

    event.body = {
      caseReference,
      applicationId,
      documentId,
    };

    BlobServiceClient.fromConnectionString.mockReturnValue(blobServiceClient);
    event.getSecret.mockResolvedValue(secretValue);
    blobDownloader.downloadToBuffer.mockRejectedValue(blobError);

    axios.get.mockResolvedValue({
      data: docServiceOutput,
    });

    expect(await handler(event, context)).toEqual({
      message: 'General error',
    });

    expect(BlobServiceClient.fromConnectionString).toBeCalledWith(secretValue);
    expect(event.getSecret).toBeCalledWith(process.env.STORAGE_CONNECTION_STRING_SECRET);
    expect(blobServiceClient.getContainerClient).toBeCalledWith(process.env.STORAGE_CONTAINER_NAME);

    expect(context.httpStatus).toBe(500);
  });

  it('should handle an error from the document service', async () => {
    const secretValue = 'some-secret3';
    const caseReference = '1234567893';
    const applicationId = 'some-app-id3';
    const documentId = 'some-document-id3';
    const docsMessage = 'some-docs-error';
    const horizonOutput = {
      some: 'response3',
    };
    const blobBuffer = Buffer.from('hello world3');

    event.body = {
      caseReference,
      applicationId,
      documentId,
    };

    BlobServiceClient.fromConnectionString.mockReturnValue(blobServiceClient);
    event.getSecret.mockResolvedValue(secretValue);
    blobDownloader.downloadToBuffer.mockResolvedValue(blobBuffer);

    axios.get.mockRejectedValue({
      message: docsMessage,
      response: {
        data: 'err-data',
        status: 'err-status',
        headers: 'err-header',
      },
    });

    axios.post.mockResolvedValue({
      data: horizonOutput,
    });

    expect(await handler(event, context)).toEqual({
      message: docsMessage,
    });

    expect(BlobServiceClient.fromConnectionString).toBeCalledWith(secretValue);
    expect(event.getSecret).toBeCalledWith(process.env.STORAGE_CONNECTION_STRING_SECRET);
    expect(blobServiceClient.getContainerClient).toBeCalledWith(process.env.STORAGE_CONTAINER_NAME);
  });

  it('should handle an error from horizon', async () => {
    const secretValue = 'some-secret4';
    const caseReference = '1234567894';
    const applicationId = 'some-app-id4';
    const documentId = 'some-document-id4';
    const docServiceOutput = {
      blobStorageLocation: 'blob-storage-location4',
      name: 'some-file-name4',
      createdAt: '2021-02-11T12:00:00Z',
    };
    const horizonMessage = 'some-horizon-error';
    const blobBuffer = Buffer.from('hello world4');

    event.body = {
      caseReference,
      applicationId,
      documentId,
    };

    BlobServiceClient.fromConnectionString.mockReturnValue(blobServiceClient);
    event.getSecret.mockResolvedValue(secretValue);
    blobDownloader.downloadToBuffer.mockResolvedValue(blobBuffer);

    axios.get.mockResolvedValue({
      data: docServiceOutput,
    });

    axios.post.mockRejectedValue({
      message: horizonMessage,
      request: 'some-request',
    });

    expect(await handler(event, context)).toEqual({
      message: horizonMessage,
    });

    expect(BlobServiceClient.fromConnectionString).toBeCalledWith(secretValue);
    expect(event.getSecret).toBeCalledWith(process.env.STORAGE_CONNECTION_STRING_SECRET);
    expect(blobServiceClient.getContainerClient).toBeCalledWith(process.env.STORAGE_CONTAINER_NAME);
  });
});
