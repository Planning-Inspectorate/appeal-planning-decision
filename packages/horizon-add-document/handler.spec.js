jest.mock('axios');
process.env.DOCUMENT_SERVICE_URL = 'document-url';
process.env.HORIZON_URL = 'horizon-url';

const axios = require('axios');
const handler = require('./handler');

describe('handler', () => {
  const envvars = process.env;
  let context;
  let event;

  beforeEach(() => {
    process.env = { ...envvars };

    event = {
      body: {},
      log: {
        info: jest.fn(),
        error: jest.fn(),
      },
    };

    context = {
      httpStatus: 200,
    };
  });

  afterEach(() => {
    process.env = envvars;
  });

  it('should download the file from blob storage and push to Horizon', async () => {
    const caseReference = '1234567890';
    const applicationId = 'some-app-id';
    const documentId = 'some-document-id';
    const documentType = 'some-doc-type';
    const docServiceOutput = {
      blobStorageLocation: 'blob-storage-location',
      name: 'some-file-name',
      createdAt: '2021-02-07T12:00:00Z',
      data: 'base64',
    };
    const horizonOutput = {
      some: 'response',
    };

    event.body = {
      caseReference,
      applicationId,
      documentId,
      documentType,
    };

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
                'a:Content': docServiceOutput.data,
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
        maxBodyLength: Infinity,
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

  it('should handle an error from the document service', async () => {
    const caseReference = '1234567893';
    const applicationId = 'some-app-id3';
    const documentId = 'some-document-id3';
    const docsMessage = 'some-docs-error';
    const horizonOutput = {
      some: 'response3',
    };

    event.body = {
      caseReference,
      applicationId,
      documentId,
    };

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
  });

  it('should handle an error from horizon', async () => {
    const caseReference = '1234567894';
    const applicationId = 'some-app-id4';
    const documentId = 'some-document-id4';
    const docServiceOutput = {
      blobStorageLocation: 'blob-storage-location4',
      name: 'some-file-name4',
      createdAt: '2021-02-11T12:00:00Z',
      data: 'base642',
    };
    const horizonMessage = 'some-horizon-error';

    event.body = {
      caseReference,
      applicationId,
      documentId,
    };

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
  });
});
