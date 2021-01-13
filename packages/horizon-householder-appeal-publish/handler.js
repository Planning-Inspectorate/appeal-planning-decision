const axios = require('axios');

const config = {
  appealsService: {
    url: process.env.APPEALS_SERVICE_URL,
  },
  horizon: {
    url: process.env.HORIZON_URL,
  },
  openfaas: {
    gatewayUrl: process.env.GATEWAY_URL,
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

log({ config });

function convertToSoapKVPair(key, value) {
  log('Parsing soap key/value pair', {
    key,
    value,
  });

  if (Array.isArray(value)) {
    return {
      'a:AttributeValue': {
        '__i:type': 'a:SetAttributeValue',
        'a:Name': key,
        'a:Values': value.map((item) => convertToSoapKVPair(item.key, item.value)),
      },
    };
  }

  if (value.toISOString) {
    /* Value is a date */
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
 * @param input
 * @returns {Promise<string>}
 */
async function callHorizon(input) {
  log('Calling Horizon', input);

  const { data } = await axios.post('/horizon', input, {
    baseURL: config.horizon.url,
  });

  log('Horizon response', data);

  // case IDs are in format APP/W4705/D/21/3218521 - we need last 7 digits or numbers after final slash (always the same)
  const horizonFullCaseId = data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult?.value;

  if (!horizonFullCaseId) {
    throw new Error('Horizon ID malformed');
  }

  return horizonFullCaseId.split('/').slice(-1).pop();
}

/**
 * Create Contacts
 *
 * Takes the body data, parses it into agent/appellant, creates the
 * contact inside Horizon and returns the data that is in the format
 * that can be used by the CreateCase endpoint.
 *
 * @param {*} body
 * @returns {Promise}
 */
async function createContacts(body) {
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

  log(logMessage, contacts);

  return Promise.all(
    contacts.map(async ({ name, email, type }) => {
      /* Create the user in Horizon */
      const [firstName, ...lastName] = name.split(' ');

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
 * @param code
 * @returns {Promise<{ id: string, name: string, inTrial: boolean, england: boolean, wales: boolean, horizonId: string }>}
 */
async function getLpaData(code) {
  const { data } = await axios.get(`/api/v1/local-planning-authorities/${code}`, {
    baseURL: config.appealsService.url,
  });

  if (!data?.horizonId) {
    log('LPA not found', { code });
    throw new Error('Unknown LPA');
  }

  return data;
}

module.exports = async (event, context) => {
  try {
    const { body } = event;

    const { _id: appealId } = body;

    /* Get the LPA associated with this appeal */
    const lpa = await getLpaData(body.appeal.lpaCode);

    log('LPA detail', { lpa });

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
        value: 'Portal',
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
        key: 'Case:Procedure',
        value: 'Hearing',
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
        key: 'Case Site:Site Viewable From Road',
        value: body.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
      },
    ];

    /* Create the contacts and add to attribute data */
    attributeData.push(...(await createContacts(body)));

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
          'a:Attributes': attributeData.map(({ key, value }) => convertToSoapKVPair(key, value)),
        },
      },
    };

    const horizonCaseId = await callHorizon(input);

    log('Adding Horizon ID to Appeal', { horizonId: horizonCaseId });
    await axios.patch(
      `/api/v1/appeals/${appealId}`,
      {
        horizonId: horizonCaseId,
      },
      {
        baseURL: config.appealsService.url,
      }
    );

    log('Successful call to Horizon', { horizonCaseId });
    return {
      id: horizonCaseId,
    };
  } catch (err) {
    let message;
    let httpStatus = 500;

    if (err.response) {
      message = 'No response received from Horizon';
      log(message, {
        message: err.message,
        data: err.response.data,
        status: err.response.status,
        headers: err.response.headers,
      });
    } else if (err.request) {
      message = 'Error sending to Horizon';
      httpStatus = 400;
      log(message, {
        message: err.message,
        request: err.request,
      });
    } else {
      /* istanbul ignore next */
      message = err.message ?? 'General error';
      log(message, {
        message: err.message,
        stack: err.stack,
      });
    }

    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};
