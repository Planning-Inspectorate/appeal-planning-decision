const axios = require('axios');
const debug = require('debug')('openfaas');

const config = {
  documents: {
    url: process.env.DOCUMENT_SERVICE_URL,
  },
  horizon: {
    url: process.env.HORIZON_URL,
  },
};

async function parseFile(documentId, applicationId, documentType) {
  debug('Getting document', { applicationId, documentId });

  const { data } = await axios.get(`/api/v1/${applicationId}/${documentId}/file`, {
    baseURL: config.documents.url,
    params: {
      base64: true,
    },
  });

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
              'a:Value': data.createdAt,
            },
          },
        ],
      },
      'a:NodeId': '0',
    },
  };
}

debug({ config });

module.exports = async (event, context) => {
  try {
    const { body } = event;
    const { caseReference, applicationId, documentId, documentType } = body;

    const input = {
      AddDocuments: {
        __soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
        __xmlns: 'http://tempuri.org/',
        caseReference,
        documents: [
          { '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
          { '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
          await parseFile( documentId, applicationId, documentType),
        ],
      },
    };

    debug('Uploading documents to Horizon');

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

    /* istanbul ignore else */
    if (err.response) {
      message = err.message;
      debug(
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
      debug(
        message,
        JSON.stringify({
          message: err.message,
          request: err.request,
        })
      );
    } else {
      message = 'General error';
      debug(
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
