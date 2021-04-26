const axios = require('axios');
const config = require('./config');

/**
 * Publish Documents
 *
 * Publishes the documents to Horizon. This is done asynchronously
 * as we're not interested in the response
 *
 * @param log
 * @param {{id: string, type: string}[]} documents
 * @param {string} serviceId
 * @param {string} horizonId
 */
const publishDocuments = async (log, documents, serviceId, horizonId) => {
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
            serviceId,
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
            applicationId: serviceId,
          },
          {
            baseURL: config.openfaas.gatewayUrl,
          }
        );

        log.debug('Publish document request accepted');
      })
  );
};

module.exports = { publishDocuments };
