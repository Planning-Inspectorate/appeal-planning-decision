const ListAddMoreQuestion = require('../dynamic-components/list-add-more/question');

/**
 * @typedef {import('../question')} Question
 * @typedef {import('appeals-service-api/src/spec/api-types').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * returns the sub question we're on a ListAddMoreQuestion and we're not on the add more page
 * @param {ExpressRequest} req
 * @param {Question|undefined} questionObj
 * @returns
 */
function getAddMoreIfPresent(req, questionObj) {
	if (!(questionObj instanceof ListAddMoreQuestion)) {
		return questionObj;
	}

	if (!req.body[questionObj.fieldName]) {
		if (
			Object.getOwnPropertyNames(req.body).find(
				(prop) =>
					prop === questionObj.subQuestion.fieldName ||
					prop.includes(questionObj.subQuestion.fieldName)
			)
		) {
			questionObj = questionObj.subQuestion;
		}
	}

	return questionObj;
}

/**
 * Converts booleans in the LPAQuestionnaireSubmission db model into yes/no strings
 * @param {LPAQuestionnaireSubmission} dbResponse
 */

function convertDBResponseBooleansToStrings(dbResponse) {
	let convertedResponse = {};
	for (const key of Object.keys(dbResponse)) {
		if (dbResponse[key] === true) {
			convertedResponse[key] = 'yes';
		} else if (dbResponse[key] === false) {
			convertedResponse[key] = 'no';
		} else {
			convertedResponse[key] = dbResponse[key];
		}
	}

	return convertedResponse;
}

module.exports = { getAddMoreIfPresent, convertDBResponseBooleansToStrings };
