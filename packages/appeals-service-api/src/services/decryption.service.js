const crypto = require('crypto');
const config = require('../configuration/config');

class DecryptionService {
	constructor() {}

	/**
	 * @param {string}
	 * @return {string}
	 */
	decryptFinalCommentsSecureCode(value) {
		let decipher = crypto.createDecipheriv(
			config.secureCodes.finalComments.decipher.algorithm,
			config.secureCodes.finalComments.decipher.securityKey,
			config.secureCodes.finalComments.decipher.initVector
		);

		let decryptedValue = decipher.update(
			value,
			config.secureCodes.finalComments.decipher.inputEncoding,
			config.secureCodes.finalComments.decipher.outputEncoding
		);
		decryptedValue += decipher.final(config.secureCodes.finalComments.decipher.outputEncoding);

		return decryptedValue;
	}
}

module.exports = { DecryptionService };
