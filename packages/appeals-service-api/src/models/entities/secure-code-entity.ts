import { generatePinSync } from 'secure-pin';
const config = require('../../configuration/config');

export class SecureCodeEntity {
	private pin: string;
	private expiration: number;

	constructor() {
		this.setPin();
	}

	setPin(): void {
		this.pin = generatePinSync(Number(config.secureCodes.finalComments.length));
		this.expiration =
			new Date().valueOf() + config.secureCodes.finalComments.expirationTimeInMinutes * 60000;
	}
	getPin(): string {
		return this.pin;
	}
}
