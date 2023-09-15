const ListAddMoreQuestion = require('../dynamic-components/list-add-more/question');

/**
 * @typedef {import('../question')} Question
 */

/**
 * returns the sub question we're on a ListAddMoreQuestion and we're not on the add more page
 * @param {ExpressRequest} req
 * @param {Question|undefined} questionObj
 * @returns
 */
function getSubquestionIfPresent(req, questionObj) {
	if (!(questionObj instanceof ListAddMoreQuestion)) {
		return questionObj;
	}

	const isAddMorePage = Object.prototype.hasOwnProperty.call(req.body, 'add-more-question');
	if (!isAddMorePage) {
		questionObj = questionObj.subQuestion;
	}

	return questionObj;
}

module.exports = { getSubquestionIfPresent };
