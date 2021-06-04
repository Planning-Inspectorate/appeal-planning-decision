const config = require('./src/config');
const sectionTypes = require('./src/sectionTypes');
const { publishDocuments } = require('./src/publishDocuments');
const { catchErrorHandling } = require('./src/catchErrorHandling');

// ***** OBJECTS ***** //

const documentsSections = {
  plansDecision: 'requiredDocumentsSection',
  officersReport: 'requiredDocumentsSection',
  interestedPartiesApplication: 'optionalDocumentsSection',
  representationsInterestedParties: 'optionalDocumentsSection',
  interestedPartiesAppeal: 'optionalDocumentsSection',
  planningHistory: 'optionalDocumentsSection',
  statutoryDevelopment: 'optionalDocumentsSection',
  otherPolicies: 'optionalDocumentsSection',
  supplementaryPlanningDocuments: 'optionalDocumentsSection',
};

// ***** FUNCTIONALITY ***** //

/**
 * Convert Document Array
 * Converts uploadedFiles array to array of document objects
 *
 * @param {array} arrayOfFiles array of id and filename objects
 * @param {array} type
 * @returns {documents} documents object for Horizon
 */
const convertDocumentArray = (arrayOfFiles, type) => {
  return arrayOfFiles.map((file) => {
    return { id: file.id, type };
  });
};

/**
 * Populate Documents
 * For each document, this function creates an object with the necessary
 * id and type, and pushes it onto the document object
 *
 * @param {object} body contains the reply object
 * @returns {documents} documents object for Horizon
 */
const populateDocuments = (body) => {
  const documents = [];

  Object.keys(documentsSections).forEach((key) => {
    if (body[documentsSections[key]] !== undefined) {
      documents.push(
        convertDocumentArray(
          body[documentsSections[key]][key].uploadedFiles,
          sectionTypes[`${key}Type`]
        )
      );
    }
  });

  return documents.flat();
};

// ***** MAIN FUNCTION ***** //

/**
 * Handler Reply
 * Publishes the documents to Horizon
 *
 * @param {object} event contains body.reply
 * @param {string} horizonCaseId
 * @param {string} context contains the httpStatusCode
 *
 * @typedef {{ id: string }} horizonCaseId
 * @typedef {{ message: string }} errorMessage
 *
 * @returns {horizonCaseId | errorMessage}
 */
const handlerReply = async (event, context) => {
  event.log.info({ config }, 'Received householder reply publish request');
  try {
    event.log.info({ event }, 'STEVE: handler-reply');
    const { body } = event;
    const replyId = body.id;
    const horizonCaseId = '3219717'; // TODO: Add via API
    await publishDocuments(event.log, populateDocuments(body), replyId, horizonCaseId);
    return {
      id: horizonCaseId,
    };
  } catch (err) {
    const [message, httpStatus] = catchErrorHandling(event, err);
    context.httpStatus = httpStatus;
    return {
      message,
    };
  }
};

// ***** EXPORTS ***** //

module.exports = { convertDocumentArray, populateDocuments, handlerReply };
