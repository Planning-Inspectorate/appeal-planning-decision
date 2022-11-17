import { generatePinSync } from 'secure-pin';
const config = require('../../configuration/config');

export class SecureCodeEntity {
	private pin: string;
	private expiration: number;

	constructor() {
		this.pin = this.generatePin();
		this.expiration = this.generateExpiration();
	}

	private generatePin(): string {
		return generatePinSync(Number(config.secureCodes.finalComments.length));
	}

	private generateExpiration(): number {
		return new Date().valueOf() + config.secureCodes.finalComments.expirationTimeInMinutes * 60000;
	}
}
