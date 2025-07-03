const ListAddMoreQuestion = require('../../dynamic-components/list-add-more/question');

/**
 * @typedef {import('../../questions/question')} Question
 * @typedef {import('appeals-service-api/src/spec/api-types').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * returns the sub question we're on a ListAddMoreQuestion and we're not on the add more page
 * @param {import('express').Request} req
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
 * @param {Record<any, any>} dbResponse
 */

function mapDBResponseToJourneyResponseFormat(dbResponse) {
	return Object.entries(dbResponse).reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: (() => {
				switch (value) {
					case true:
						return 'yes';
					case false:
						return 'no';
					default:
						return value;
				}
			})()
		}),
		{}
	);
}

module.exports = { getAddMoreIfPresent, mapDBResponseToJourneyResponseFormat };
