/**
 * @param {*} val
 * @returns {boolean}
 */
export const isNonEmptyString = (val) => {
	return typeof val === 'string' && val.trim() !== '';
};
