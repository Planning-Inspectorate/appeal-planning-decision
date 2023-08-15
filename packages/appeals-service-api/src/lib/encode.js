/**
 * encodes URI component unsafe chars for the string passed in
 * @param {string} ref
 * @returns {string} The url-friendly string
 */
function encodeUrlSlug(ref) {
	return encodeURIComponent(ref);
}

module.exports = {
	encodeUrlSlug
};
