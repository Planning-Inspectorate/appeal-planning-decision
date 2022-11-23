const { generatePinSync } = require('secure-pin');
const config = require('../../configuration/config');

class SecureCodeEntity {

	constructor() {
		this.pin = this.#generatePin();
		this.expiration = this.#generateExpiration();
	}

	/**
	 * 
	 * @return {string}
	 */
	#generatePin() {
		return generatePinSync(Number(config.secureCodes.finalComments.length));
	}

	/**
	 * 
	 * @return {number}
	 */
	#generateExpiration() {
		return new Date().valueOf() + config.secureCodes.finalComments.expirationTimeInMinutes * 60000;
	}
}

module.exports = { SecureCodeEntity }