/**
 * Replaces /'s and encodes URI component unsafe chars for the string passed in
 * handles non string values as per encodeURIComponent
 * @param {string} ref
 * @returns {string} The url-friendly string
 */
function encodeUrlSlug(ref) {
	if (typeof ref === 'string') {
		ref = ref.replace(/\//g, '_');
	}

	return encodeURIComponent(ref);
}

function decodeUrlSlug(ref) {
	ref = decodeURIComponent(ref);

	if (typeof ref === 'string') {
		ref = ref.replace(/_/g, '/');
	}

	return ref;
}

module.exports = {
	encodeUrlSlug,
	decodeUrlSlug
};
