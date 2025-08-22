/**
 * @param {unknown} answer
 * @returns {string | number}
 */
const getPersistedNumberAnswer = (answer) => {
	if (answer === 0) {
		// convert 0 to string to stop being treated as falsy
		return answer.toString();
	} else if (answer !== undefined && answer !== null && typeof answer === 'number') {
		// all other numbers can stay as numbers
		return answer;
	} else {
		return '';
	}
};

module.exports = { getPersistedNumberAnswer };
