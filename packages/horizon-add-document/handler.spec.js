jest.mock('axios');
process.env.DOCUMENT_SERVICE_URL = 'document-url';
process.env.HORIZON_URL = 'horizon-url';

const axios = require('axios');
const handler = require('./handler');

const { createDataObject, getCaseReferenceFromAPI } = handler;

const mockEventBody = {
  caseReference: '1234567890',
  applicationId: 'some-app-id',
  documentId: 'some-document-id',
  documentType: 'LPA Decision Notice',
  documentInvolvement: 'some-doc-involvement',
  documentGroupType: 'some-doc-group-type',
  docServiceOutput: {
    blobStorageLocation: 'blob-storage-location',
    name: 'some-file-name',
    createdAt: '2021-02-07T12:00:00Z',
    data: 'base64',
  },
  horizonOutput: {
    some: 'response',
  },
};

const data = {
  data: 'some-data',
  name: 'some-data-name',
  createdAt: 'some-data-createdAt',
};

describe('getCaseReferenceFromAPI', () => {
  it('should return the caseReference from the appeal using the API', async () => {
    expect(await getCaseReferenceFromAPI()).toEqual('case-reference-api-call');
  });
});

describe('createDataObject', () => {
  let eventBody;

  beforeEach(() => {
    eventBody = { ...mockEventBody };
  });

  it('documentInvolvementValue should be "LPA", if reply', () => {
    const expectedItem = {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': 'some-doc-involvement',
        'a:Value': 'LPA',
      },
    };
    eventBody.documentType = 'Consultation Responses';
    const result = createDataObject(data, eventBody);
    expect(result['a:HorizonAPIDocument']['a:Metadata']['a:Attributes']).toContainEqual(
      expectedItem
    );
  });

  it('documentGroupTypeValue should be "Evidence", if reply', () => {
    const expectedItem = {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': 'some-doc-group-type',
        'a:Value': 'Evidence',
      },
    };
    eventBody.documentType = 'Consultation Responses';
    const result = createDataObject(data, eventBody);
    expect(result['a:HorizonAPIDocument']['a:Metadata']['a:Attributes']).toContainEqual(
      expectedItem
    );
  });

  it('documentInvolvement should be specific entries, if defined', () => {
    const expectedItem = {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': 'some-doc-involvement',
        'a:Value': 'Appellant',
      },
    };

    const result = createDataObject(data, eventBody);
    expect(result['a:HorizonAPIDocument']['a:Metadata']['a:Attributes']).toContainEqual(
      expectedItem
    );
  });

  it('documentInvolvement should be default entries, if null', () => {
    const expectedItem = {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': 'Document:Involvement',
        'a:Value': 'Appellant',
      },
    };
    const result = createDataObject(data, { ...eventBody, documentInvolvement: null });
    expect(result['a:HorizonAPIDocument']['a:Metadata']['a:Attributes']).toContainEqual(
      expectedItem
    );
  });

  it('documentGroupType should be specific entries, if defined', () => {
    const expectedItem = {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': 'some-doc-group-type',
        'a:Value': 'Initial Documents',
      },
    };
    const result = createDataObject(data, eventBody);
    expect(result['a:HorizonAPIDocument']['a:Metadata']['a:Attributes']).toContainEqual(
      expectedItem
    );
  });

  it('documentGroupType should be default entries, if null', () => {
    const expectedItem = {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': 'Document:Document Group Type',
        'a:Value': 'Initial Documents',
      },
    };

    const result = createDataObject(data, { ...eventBody, documentGroupType: null });
    expect(result['a:HorizonAPIDocument']['a:Metadata']['a:Attributes']).toContainEqual(
      expectedItem
    );
  });
});

describe('handler', () => {
  const envvars = process.env;
  let context;
  let event;

  beforeEach(() => {
    process.env = { ...envvars };

    event = {
      body: { ...mockEventBody },
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
    const { caseReference } = event.body;

    axios.get.mockResolvedValue({
      data: event.body.docServiceOutput,
    });

    axios.post.mockResolvedValue({
      data: event.body.horizonOutput,
    });

    expect(await handler(event, context)).toEqual({
      caseReference,
      data: event.body.horizonOutput,
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
                'a:Content': event.body.docServiceOutput.data,
                'a:DocumentType': event.body.documentType,
                'a:Filename': event.body.docServiceOutput.name,
                'a:IsPublished': 'false',
                'a:Metadata': {
                  'a:Attributes': [
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'some-doc-involvement',
                        'a:Value': 'Appellant',
                      },
                    },
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'some-doc-group-type',
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
                        'a:Value': event.body.docServiceOutput.createdAt,
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

  it('should download the file from blob storage and push to Horizon, with case reference from API', async () => {
    event.body.caseReference = null;

    axios.get.mockResolvedValue({
      data: event.body.docServiceOutput,
    });

    axios.post.mockResolvedValue({
      data: event.body.horizonOutput,
    });

    expect(await handler(event, context)).toEqual({
      caseReference: 'case-reference-api-call',
      data: event.body.horizonOutput,
    });

    expect(axios.post).toBeCalledWith(
      '/horizon',
      {
        AddDocuments: {
          __soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
          __xmlns: 'http://tempuri.org/',
          caseReference: 'case-reference-api-call',
          documents: [
            { '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
            { '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
            {
              'a:HorizonAPIDocument': {
                'a:Content': event.body.docServiceOutput.data,
                'a:DocumentType': event.body.documentType,
                'a:Filename': event.body.docServiceOutput.name,
                'a:IsPublished': 'false',
                'a:Metadata': {
                  'a:Attributes': [
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'some-doc-involvement',
                        'a:Value': 'Appellant',
                      },
                    },
                    {
                      'a:AttributeValue': {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'some-doc-group-type',
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
                        'a:Value': event.body.docServiceOutput.createdAt,
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
