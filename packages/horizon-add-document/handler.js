const axios = require('axios');

const config = {
  documents: {
    url: process.env.DOCUMENT_SERVICE_URL,
  },
  horizon: {
    url: process.env.HORIZON_URL,
  },
};

function createDataObject(data, body) {
  const { documentType } = body;
  const documentInvolvement = body.documentInvolvement || 'Document:Involvement';
  const documentGroupType = body.documentGroupType || 'Document:Document Group Type';

  return {
    // The order of this object is important
    'a:HorizonAPIDocument': {
      'a:Content': data.data,
      'a:DocumentType': documentType,
      'a:Filename': data.name,
      'a:IsPublished': 'true',
      'a:Metadata': {
        'a:Attributes': [
          {
            'a:AttributeValue': {
              '__i:type': 'a:StringAttributeValue',
              'a:Name': documentInvolvement,
              'a:Value': 'Appellant',
            },
          },
          {
            'a:AttributeValue': {
              '__i:type': 'a:StringAttributeValue',
              'a:Name': documentGroupType,
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
              'a:Value': data.createdAt,
            },
          },
        ],
      },
      'a:NodeId': '0',
    },
  };
}

async function parseFile({ log, body }) {
  const { documentId, applicationId, documentType } = body;
  log.info({ applicationId, documentId, documentType }, 'Downloading document');

  const { data } = await axios.get(`/api/v1/${applicationId}/${documentId}/file`, {
    baseURL: config.documents.url,
    params: {
      base64: true,
    },
  });

  return createDataObject(data, body);
}

module.exports = async (event, context) => {
  event.log.info({ config }, 'Receiving add document request');

  try {
    const { caseReference } = event.body;

    const input = {
      AddDocuments: {
        __soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
        __xmlns: 'http://tempuri.org/',
        caseReference,
        documents: [
          { '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
          { '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
          await parseFile(event),
        ],
      },
    };

    event.log.info('Uploading documents to Horizon');

    const { data } = await axios.post('/horizon', input, {
      baseURL: config.horizon.url,
      /* Needs to be infinity as Horizon doesn't support multipart uploads */
      maxBodyLength: Infinity,
    });

    return {
      caseReference,
      data,
    };
  } catch (err) {
    let message;
    let httpStatus = 500;

    /* istanbul ignore else */
    if (err.response) {
      message = err.message;
      event.log.error(
        {
          message: err.message,
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        },
        message
      );
    } else if (err.request) {
      message = err.message;
      httpStatus = 400;
      event.log.error(
        {
          message: err.message,
          request: err.request,
        },
        message
      );
    } else {
      message = 'General error';
      event.log.error(
        {
          message: err?.message,
          stack: err?.stack,
        },
        message
      );
    }

    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};

module.exports.createDataObject = createDataObject;
