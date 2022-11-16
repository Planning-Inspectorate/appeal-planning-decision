import { generatePin } from 'secure-pin';
const config = require('../../configuration/config');

export class SecureCodeEntity {
	private pin: string;
	private expiration: number;

	constructor() {
		this.pin = "";
		this.expiration = 0;
		this.setPin();
	}

	setPin(): void {
		generatePin(Number(config.secureCodes.finalComments.length), (pin: string) => {
			this.pin = pin;
			this.expiration =
				new Date().valueOf() + config.secureCodes.finalComments.expirationTimeInMinutes * 60000;
		});
	}

	getPin(): string {
		return this.pin;
	}
}