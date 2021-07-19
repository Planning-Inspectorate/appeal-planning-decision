const config = require('./src/config');
const sectionTypes = require('./src/sectionTypes');
const { publishDocuments } = require('./src/publishDocuments');
const { catchErrorHandling } = require('./src/catchErrorHandling');
const { getHorizonId } = require('./src/getHorizonId');

// ***** OBJECTS ***** //

const documentsSections = {
  plansDecision: 'requiredDocumentsSection',
  officersReport: 'requiredDocumentsSection',
  interestedPartiesApplication: 'optionalDocumentsSection',
  representationsInterestedParties: 'optionalDocumentsSection',
  interestedPartiesAppeal: 'optionalDocumentsSection',
  siteNotices: 'optionalDocumentsSection',
  conservationAreaMap: 'optionalDocumentsSection',
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
const populateDocuments = (event) => {
  const documents = [];

  Object.keys(documentsSections).forEach((key) => {
    if (event.body[documentsSections[key]] !== undefined) {
      documents.push(
        convertDocumentArray(
          event.body[documentsSections[key]][key].uploadedFiles,
          sectionTypes[`${key}Type`]
        )
      );
    }
  });

  const id = event.body.submission.pdfStatement?.uploadedFile.id;

  if (id === undefined) {
    const message = 'PDF not present in submission';
    event.log.error(
      {
        message,
        data: event.body.submission,
      },
      message
    );
  } else {
    documents.push({ id, type: sectionTypes.pdfType });
  }

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
  let horizonId;

  try {
    horizonId = await getHorizonId(event.body.appealId);
  } catch (err) {
    const message = 'Horizon failed due to non-existant horizonId';
    context.httpStatus = 500;
    event.log.error(
      {
        message,
        data: event.body.appealId,
        status: 500,
        headers: null,
      },
      message
    );
    return {
      message,
    };
  }

  try {
    const { body } = event;
    const replyId = body.id;
    await publishDocuments(event.log, populateDocuments(event), replyId, horizonId);
    return {
      id: horizonId,
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

module.exports = { convertDocumentArray, populateDocuments, handlerReply, getHorizonId };
