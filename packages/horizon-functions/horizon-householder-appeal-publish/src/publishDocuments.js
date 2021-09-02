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

        await rabbitmq.publisher('add-document', {
          documentId,
          documentType,
          caseReference: horizonId,
          applicationId: serviceId,
        });

        log.debug('Publish document request accepted');
      })
  );
};

module.exports = { publishDocuments };
