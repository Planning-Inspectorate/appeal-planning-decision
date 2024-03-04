/**
 * Nunjucks filter to discern if there are items in an array
 * @param {*} maybeArray
 * @returns {boolean}
 */
exports.arrayHasItems = (maybeArray) => {
	if (!Array.isArray(maybeArray)) return false;
	return !!maybeArray.length;
};
