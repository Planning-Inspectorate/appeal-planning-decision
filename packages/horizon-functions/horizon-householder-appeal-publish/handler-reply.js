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
	supplementaryPlanningDocuments: 'optionalDocumentsSection'
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
const populateDocuments = (log, body) => {
	const documents = [];

	Object.keys(documentsSections).forEach((key) => {
		if (body[documentsSections[key]] !== undefined) {
			documents.push(
				convertDocumentArray(
					body[documentsSections[key]][key]?.uploadedFiles || [],
					sectionTypes[`${key}Type`]
				)
			);
		}
	});

	// const id = body.submission.pdfStatement?.uploadedFile?.id;

	/*
  if (typeof id === 'undefined') {
    const message = 'PDF not present in submission';
    log.error(
      {
        message,
        data: body.submission,
      },
      message
    );
  } else {
    documents.push({ id, type: sectionTypes.pdfType });
  } */

	return documents.flat();
};

// ***** MAIN FUNCTION ***** //

/**
 * Handler Reply
 * Publishes the documents to Horizon
 *
 * @param {object} appeal contains body.reply
 * @param {string} horizonCaseId
 * @param {string} context contains the httpStatusCode
 *
 * @typedef {{ id: string }} horizonCaseId
 * @typedef {{ message: string }} errorMessage
 *
 * @returns {horizonCaseId | errorMessage}
 */
const handlerReply = async (context, appeal) => {
	context.log({ config }, 'Received householder reply publish request');
	let horizonId;

	try {
		horizonId = await getHorizonId(appeal?.appealId);
	} catch (err) {
		const message = 'Horizon failed due to non-existant horizonId';
		context.httpStatus = 500;
		context.log(
			{
				message,
				data: appeal?.appealId,
				status: 500,
				headers: null
			},
			message
		);
		context.log(
			{
				message,
				data: appeal?.appealId,
				status: 500,
				headers: null
			},
			message
		);
		context.done();
		return {
			message
		};
	}

	try {
		const replyId = appeal.id;
		context.log(`publishing documents with reply id: ${replyId}`);
		await publishDocuments(context.log, populateDocuments(context.log, appeal), replyId, horizonId);
		context.done();
		return {
			id: horizonId
		};
	} catch (err) {
		const [message, httpStatus] = catchErrorHandling(context.log, err);
		context.httpStatus = httpStatus;
		return {
			message
		};
	}
};

// ***** EXPORTS ***** //

module.exports = { convertDocumentArray, populateDocuments, handlerReply, getHorizonId };
