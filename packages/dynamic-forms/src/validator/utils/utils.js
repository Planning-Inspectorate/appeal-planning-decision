const ListAddMoreQuestion = require('../../dynamic-components/list-add-more/question');

/**
 * @typedef {import('../../question')} Question
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

module.exports = { getAddMoreIfPresent };
