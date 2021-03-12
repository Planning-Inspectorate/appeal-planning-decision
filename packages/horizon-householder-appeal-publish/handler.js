const axios = require('axios');

const config = {
  appealsService: {
    url: process.env.APPEALS_SERVICE_URL,
  },
  documentService: {
    url: process.env.DOCUMENT_SERVICE_URL,
  },
  horizon: {
    url: process.env.HORIZON_URL,
  },
  openfaas: {
    gatewayUrl: process.env.GATEWAY_URL,
  },
};

function convertToSoapKVPair(log, key, value) {
  log.debug(
    {
      key,
      value,
    },
    'Parsing soap key/value pair'
  );

  if (Array.isArray(value)) {
    log.debug('Parsing as array');
    return {
      'a:AttributeValue': {
        '__i:type': 'a:SetAttributeValue',
        'a:Name': key,
        'a:Values': value.map((item) => convertToSoapKVPair(log, item.key, item.value)),
      },
    };
  }

  if (value == null) {
    log.debug('Parsing as null');
    return {
      'a:AttributeValue': {
        '__i:type': 'a:StringAttributeValue',
        'a:Name': key,
        'a:Value': null,
      },
    };
  }

  if (value.toISOString) {
    /* Value is a date */
    log.debug('Parsing as date');
    return {
      'a:AttributeValue': {
        '__i:type': 'a:DateAttributeValue',
        'a:Name': key,
        'a:Value': value.toISOString(),
      },
    };
  }

  let cleanValue = value;

  /* Check for booleans - convert to "Yes" or "No" */
  if (cleanValue === true) {
    cleanValue = 'Yes';
  } else if (cleanValue === false) {
    cleanValue = 'No';
  }

  /* Everything else is a string */
  log.debug('Parsing as string');
  return {
    'a:AttributeValue': {
      '__i:type': 'a:StringAttributeValue',
      'a:Name': key,
      'a:Value': `${cleanValue}`, // Ensure value a string
    },
  };
}

/**
 * Call Horizon
 *
 * Calls Horizon and gets the ID of the created
 * case
 *
 * @param log
 * @param input
 * @returns {Promise<string>}
 */
async function callHorizon(log, input) {
  log.info(input, 'Calling Horizon');

  const { data } = await axios.post('/horizon', input, {
    baseURL: config.horizon.url,
  });

  log.info({ data }, 'Horizon response');

  // case IDs are in format APP/W4705/D/21/3218521 - we need last 7 digits or numbers after final slash (always the same)
  const horizonFullCaseId = data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult?.value;

  if (!horizonFullCaseId) {
    log.error(
      { input: data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult },
      'Horizon ID malformed'
    );
    throw new Error('Horizon ID malformed');
  }

  const parsedHorizonId = horizonFullCaseId.split('/').slice(-1).pop();

  log.debug({ parsedHorizonId, horizonFullCaseId }, 'Horizon ID parsed');

  return parsedHorizonId;
}

/**
 * Create Contacts
 *
 * Takes the body data, parses it into agent/appellant, creates the
 * contact inside Horizon and returns the data that is in the format
 * that can be used by the CreateCase endpoint.
 *
 * @param {*} log
 * @param {*} body
 * @returns {Promise}
 */
async function createContacts(log, body) {
  const contacts = [];
  let logMessage;

  if (body.appeal.aboutYouSection.yourDetails.isOriginalApplicant) {
    /* User is original applicant - just add appellant */
    logMessage = 'User is original applicant';
    contacts.push({
      type: 'Appellant',
      email: body.appeal.aboutYouSection.yourDetails.email,
      name: body.appeal.aboutYouSection.yourDetails.name,
    });
  } else {
    /* User is agent - add both agent and OP */
    logMessage = 'User is agent';
    contacts.push(
      {
        type: 'Agent',
        email: body.appeal.aboutYouSection.yourDetails.email,
        name: body.appeal.aboutYouSection.yourDetails.name,
      },
      {
        /* Email not collected here */
        type: 'Appellant',
        name: body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf,
      }
    );
  }

  log.info(contacts, logMessage);

  return Promise.all(
    contacts.map(async ({ name, email, type }) => {
      /* Create the user in Horizon */
      const [firstName, ...lastName] = name.split(' ');

      log.info('Inserting contact into Horizon');

      const {
        data: { id: contactId },
      } = await axios.post(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email,
        },
        {
          baseURL: config.openfaas.gatewayUrl,
        }
      );

      return {
        /* Add user contact details */
        key: 'Case Involvement:Case Involvement',
        value: [
          {
            key: 'Case Involvement:Case Involvement:ContactID',
            value: contactId,
          },
          {
            key: 'Case Involvement:Case Involvement:Contact Details',
            value: name,
          },
          {
            key: 'Case Involvement:Case Involvement:Involvement Start Date',
            value: new Date(),
          },
          {
            key: 'Case Involvement:Case Involvement:Communication Preference',
            value: 'e-mail',
          },
          {
            key: 'Case Involvement:Case Involvement:Type Of Involvement',
            value: type,
          },
        ],
      };
    })
  );
}

/**
 * Get LPA Data
 *
 * Returns the LPA data
 *
 * @param log
 * @param code
 * @returns {Promise<{ id: string, name: string, inTrial: boolean, england: boolean, wales: boolean, horizonId: string }>}
 */
async function getLpaData(log, code) {
  log.info({ code }, 'Getting LPA data from Appeals Service API');

  const { data } = await axios.get(`/api/v1/local-planning-authorities/${code}`, {
    baseURL: config.appealsService.url,
  });

  if (!data?.horizonId) {
    log.error({ data }, 'LPA not found');
    throw new Error('Unknown LPA');
  }

  return data;
}

/**
 * Publish Documents
 *
 * Publishes the documents to Horizon. This is done asynchronously
 * as we're not interested in the response
 *
 * @param log
 * @param {{id: string, type: string}[]} documents
 * @param {string} appealId
 * @param {string} horizonId
 * @returns {Promise<void>}
 */
async function publishDocuments(log, documents, appealId, horizonId) {
  await Promise.all(
    documents
      /* Remove any undefined keys */
      .filter(({ id }) => id)
      .map(async ({ id: documentId, type: documentType }) => {
        log.info(
          {
            documentId,
            documentType,
            horizonId,
            appealId,
          },
          'Publish document to Horizon'
        );

        await axios.post(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            // These are named as-per Horizon keys
            caseReference: horizonId,
            applicationId: appealId,
          },
          {
            baseURL: config.openfaas.gatewayUrl,
          }
        );

        log.debug('Publish document request accepted');
      })
  );
}

module.exports = async (event, context) => {
  event.log.info({ config }, 'Received householder appeal publish request');
  try {
    const { body } = event;

    const { _id: appealId } = body;

    /* Get the LPA associated with this appeal */
    const lpa = await getLpaData(event.log, body.appeal.lpaCode);

    event.log.info({ lpa }, 'LPA detail');

    let location;
    /* PINS only supports England and Wales */
    if (lpa.england) {
      location = 'England';
    } else if (lpa.wales) {
      location = 'Wales';
    } else {
      throw new Error('LPA neither English nor Welsh');
    }

    const attributeData = [
      {
        key: 'Case Dates:Receipt Date',
        // This is the last time the record was updated
        value: new Date(body.appeal.updatedAt),
      },
      {
        key: 'Case:Source Indicator',
        value: 'Other',
      },
      {
        key: 'Case:Case Publish Flag',
        value: false,
      },
      {
        key: 'Planning Application:Date Of LPA Decision',
        value: new Date(body.appeal.decisionDate),
      },
      {
        key: 'Case:Procedure (Appellant)',
        value: 'Written Representations',
      },
      {
        key: 'Planning Application:LPA Application Reference',
        value: body.appeal.requiredDocumentsSection.applicationNumber,
      },
      {
        key: 'Case Site:Site Address Line 1',
        value: body.appeal.appealSiteSection.siteAddress.addressLine1,
      },
      {
        key: 'Case Site:Site Address Line 2',
        value: body.appeal.appealSiteSection.siteAddress.addressLine2,
      },
      {
        key: 'Case Site:Site Address Town',
        value: body.appeal.appealSiteSection.siteAddress.town,
      },
      {
        key: 'Case Site:Site Address County',
        value: body.appeal.appealSiteSection.siteAddress.county,
      },
      {
        key: 'Case Site:Site Address Postcode',
        value: body.appeal.appealSiteSection.siteAddress.postcode,
      },
      {
        key: 'Case Site:Ownership Certificate',
        value: body.appeal.appealSiteSection.siteOwnership.ownsWholeSite ? 'Certificate A' : null,
      },
      {
        key: 'Case Site:Site Viewable From Road',
        value: body.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
      },
      {
        key: 'Case Site:Inspector Need To Enter Site',
        value: !body.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
      },
    ];

    /* Create the contacts and add to attribute data */
    attributeData.push(...(await createContacts(event.log, body)));

    const input = {
      CreateCase: {
        __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
        __xmlns: 'http://tempuri.org/',
        caseType: 'Householder (HAS) Appeal',
        LPACode: lpa.horizonId,
        dateOfReceipt: new Date(),
        location,
        category: {
          '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
          '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
          'a:Attributes': attributeData.map(({ key, value }) =>
            convertToSoapKVPair(event.log, key, value)
          ),
        },
      },
    };

    const horizonCaseId = await callHorizon(event.log, input);

    event.log.info({ horizonId: horizonCaseId }, 'Adding Horizon ID to Appeal');

    await axios.patch(
      `/api/v1/appeals/${appealId}`,
      {
        horizonId: horizonCaseId,
      },
      {
        baseURL: config.appealsService.url,
      }
    );

    /*
      Finally, publish the documents to Horizon

      We treat these as non-mandatory for add documents, even though
      they are mandatory in the appeal. This is to avoid any unhelpful
      errors at this point
    */
    const documents = [
      {
        id: body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
        type: 'Appellant Grounds of Appeal',
      },
      {
        id: body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
        type: 'Appellant Initial Documents',
      },
      {
        id: body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
        type: 'LPA Decision Notice',
      },
      {
        id: body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
        type: 'Appellant Initial Documents',
      },
    ];

    /* Add optional docs to the list */
    const optionalFiles = body?.appeal?.yourAppealSection?.otherDocuments?.uploadedFiles;
    if (Array.isArray(optionalFiles)) {
      documents.push(
        ...optionalFiles.map(({ id }) => ({
          id,
          type: 'Appellant Grounds of Appeal',
        }))
      );
    }

    await publishDocuments(event.log, documents, appealId, horizonCaseId);

    event.log.info({ horizonCaseId }, 'Successful call to Horizon');
    return {
      id: horizonCaseId,
    };
  } catch (err) {
    let message;
    let httpStatus = 500;

    if (err.response) {
      message = 'No response received from Horizon';
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
      message = 'Error sending to Horizon';
      httpStatus = 400;
      event.log.error(
        {
          message: err.message,
          request: err.request,
        },
        message
      );
    } else {
      /* istanbul ignore next */
      message = err.message ?? 'General error';
      event.log.error(
        {
          message: err.message,
          stack: err.stack,
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
