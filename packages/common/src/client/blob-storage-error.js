/**
 * @class Blob Storage Client Errors
 */
class BlobStorageError extends Error {
	/**
	 * @param {string} message
	 * @param {number} code
	 */
	constructor(message, code) {
		super(message);
		this.name = 'BlobStorageError';
		/** @type {number} */
		this.code = code;
	}
}

module.exports = BlobStorageError;
