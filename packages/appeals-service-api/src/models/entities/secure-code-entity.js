const { generatePinSync } = require('secure-pin');
const config = require('../../configuration/config');

class SecureCodeEntity {

	constructor(
		pin = this.#generatePin(), 
		expiration = this.#generateExpiration()
	) {
		this.pin = pin;
		this.expiration = expiration;
	}

	getPin() {
        return this.pin;
    }

	getExpiration() {
        return this.expiration;
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
		console.log(config.secureCodes.finalComments.expirationTimeInMinutes)
		return new Date().valueOf() + config.secureCodes.finalComments.expirationTimeInMinutes * 60000;
	}
}

module.exports = { SecureCodeEntity }