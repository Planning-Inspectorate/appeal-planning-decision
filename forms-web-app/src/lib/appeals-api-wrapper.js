const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');

const config = require('../config');
const parentLogger = require('./logger');

async function handler(path, method = 'GET', opts = {}, headers = {}) {
  const correlationId = uuid.v4();
  const url = `${config.appeals.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Appeals Service API',
  });

  try {
    logger.debug({ url, method, opts, headers }, 'New call');

    return await utils.promiseTimeout(
      config.appeals.timeout,
      Promise.resolve().then(async () => {
        const apiResponse = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-ID': correlationId,
            ...headers,
          },
          ...opts,
        });

        if (!apiResponse.ok) {
          logger.debug(apiResponse, 'API Response not OK');
          throw new Error(apiResponse.statusText);
        }

        logger.debug('Successfully called');

        const data = await apiResponse.json();

        logger.debug('Successfully parsed to JSON');

        return data;
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error');
    throw err;
  }
}

/**
 * A single wrapper around creating, or updating a new or existing appeal through the Appeals
 * Service API.
 *
 * @param appeal
 * @returns {Promise<*>}
 */
exports.createOrUpdateAppeal = (appeal) => {
  let appealsServiceApiUrl = '/api/v1/appeals';
  let method = 'POST';

  if (appeal.id && appeal.id !== '') {
    appealsServiceApiUrl += `/${appeal.id}`;
    method = 'PUT';
  }

  return handler(appealsServiceApiUrl, method, {
    body: JSON.stringify(appeal),
  });
};

exports.getExistingAppeal = async (sessionId) => {
  return handler(`/api/v1/appeals/${sessionId}`);
};

exports.getLPAList = async () => {
  return handler('/api/v1/local-planning-authorities');
};

exports.EMPTY_APPEAL = {
  lpaCode: null,
  decisionDate: null,
  state: 'DRAFT',
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: null,
      name: null,
      email: null,
      appealingOnBehalfOf: '',
    },
  },
  requiredDocumentsSection: {
    applicationNumber: '',
    originalApplication: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
    decisionLetter: {
      uploadedFile: {
        name: '',
        id: null,
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        name: '',
        id: null,
      },
      hasSensitiveInformation: null,
    },
    otherDocuments: {
      documents: [],
    },
    otherAppeals: {},
  },
  appealSiteSection: {
    siteAddress: {
      addressLine1: null,
      addressLine2: null,
      town: null,
      county: null,
      postcode: null,
    },
    siteOwnership: {
      ownsWholeSite: null,
      haveOtherOwnersBeenTold: null,
    },
    siteAccess: {
      canInspectorSeeWholeSiteFromPublicRoad: null,
      howIsSiteAccessRestricted: null,
    },
    healthAndSafety: {
      hasIssues: null,
      healthAndSafetyIssues: null,
    },
  },
  sectionStates: {
    aboutYouSection: {
      yourDetails: 'NOT STARTED',
    },
    requiredDocumentsSection: {
      applicationNumber: 'NOT STARTED',
      originalApplication: 'NOT STARTED',
      decisionLetter: 'NOT STARTED',
    },
    yourAppealSection: {
      appealStatement: 'NOT STARTED',
      otherDocuments: 'NOT STARTED',
      otherAppeals: 'NOT STARTED',
    },
    appealSiteSection: {
      siteAccess: 'NOT STARTED',
      siteOwnership: 'NOT STARTED',
      healthAndSafety: 'NOT STARTED',
    },
  },
};
