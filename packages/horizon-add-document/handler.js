const axios = require('axios');
const { BlobServiceClient } = require('@azure/storage-blob');

const config = {
  blobStorage: {
    container: process.env.STORAGE_CONTAINER_NAME,
    connectionStringSecret: process.env.STORAGE_CONNECTION_STRING_SECRET, // This is defined by the key the secret is set to
  },
  documents: {
    url: process.env.DOCUMENT_SERVICE_URL,
  },
  horizon: {
    url: process.env.HORIZON_URL,
  },
};

function log(...args) {
  console.log(
    ...args.map((item) => {
      if (typeof item !== 'string') {
        return JSON.stringify(item);
      }
      return item;
    })
  );
}

async function parseFile(containerClient, documentId, applicationId) {
  log('Getting document', { applicationId, documentId });

  const { data } = await axios.get(`/api/v1/${applicationId}/${documentId}`, {
    baseURL: config.documents.url,
  });

  const { blobStorageLocation } = data;

  log('Downloading blob from storage', { blobStorageLocation });

  const blobClient = containerClient.getBlobClient(blobStorageLocation);
  const fileBuffer = await blobClient.downloadToBuffer();
  log('buffer downloaded');
  const fileData = fileBuffer.toString('base64');
  log('buffer converted to string', {
    fileSize: fileBuffer.length,
  });

  return {
    // The order of this object is important
    'a:HorizonAPIDocument': {
      'a:Content': fileData,
      'a:DocumentType': 'Initial Documents',
      'a:Filename': data.name,
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
              'a:Name': 'Document:Incoming/Outgoing/Internal',
              'a:Value': 'Incoming',
            },
          },
          {
            'a:AttributeValue': {
              '__i:type': 'a:DateAttributeValue',
              'a:Name': 'Document:Received/Sent Date',
              'a:Value': data.createdAt,
            },
          },
        ],
      },
      'a:NodeId': '0',
    },
  };
}

log({ config });

module.exports = async (event, context) => {
  try {
    const { body } = event;
    const { caseReference, applicationId, documentId } = body;

    log('Connecting to Blob Storage');

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      await event.getSecret(config.blobStorage.connectionStringSecret)
    );

    const containerClient = blobServiceClient.getContainerClient(config.blobStorage.container);

    const input = {
      AddDocuments: {
        __soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
        __xmlns: 'http://tempuri.org/',
        caseReference,
        documents: [
          { '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
          { '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
          await parseFile(containerClient, documentId, applicationId),
        ],
      },
    };

    log('Uploading documents to Horizon');

    const { data } = await axios.post('/horizon', input, {
      baseURL: config.horizon.url,
    });

    return {
      caseReference,
      data,
    };
  } catch (err) {
    let message;
    let httpStatus = 500;
    if (err.response) {
      message = err.message;
      log(
        message,
        JSON.stringify({
          message: err.message,
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        })
      );
    } else if (err.request) {
      message = err.message;
      httpStatus = 400;
      log(
        message,
        JSON.stringify({
          message: err.message,
          request: err.request,
        })
      );
    } else {
      message = 'General error';
      log(
        message,
        JSON.stringify({
          message: err?.message,
          stack: err?.stack,
        })
      );
    }

    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};
