const securePin = require('secure-pin');
const config = require('../../configuration/config');

export class SecureCodeEntity {
	private pin: number;
	private expiration: number;

	constructor() {
		this.setPin();
	}

	setPin(): void {
		securePin.generatePin(config.secureCodes.finalComments.length, (pin: number) => {
			this.pin = pin;
			this.expiration =
				new Date().valueOf() + config.secureCodes.finalComments.expirationTimeInMinutes * 60000;
		});
	}
}
