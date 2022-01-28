const config = require('./src/config');
const { publishDocuments } = require('./src/publishDocuments');
const { catchErrorHandling } = require('./src/catchErrorHandling');

const testData = [
  {
    id: 'b2433bf4-8016-11ec-a8a3-0242ac120002',
    type: 'This is important for Horizon folder location',
  },
];

// ***** MAIN FUNCTION ***** //

/**
 * Handler Reply
 * Publishes the documents to Horizon
 *
 * @param {object} event contains body.reply
 * @param {string} context contains the httpStatusCode
 *
 * @typedef {{ id: string }} horizonCaseId
 * @typedef {{ message: string }} errorMessage
 *
 * @returns {horizonCaseId | errorMessage}
 */
const handlerReply = async (context, event) => {
  context.log({ config }, 'Received householder reply publish request');
  const horizonId = `ABC/1234/1234567`;
  const replyId = event.id;

  try {
    context.log(`publishing documents with reply id: ${replyId}`);
    // uses a test data object instead of populateDocuments
    await publishDocuments(context.log, testData, replyId, horizonId);
    context.done();
    context.log(`documents published: ${replyId}`);
    return {
      id: horizonId,
    };
  } catch (err) {
    const [message, httpStatus] = catchErrorHandling(context.log, err);
    context.httpStatus = httpStatus;
    return {
      message,
    };
  }
};

// ***** EXPORTS ***** //

module.exports = { handlerReply };
