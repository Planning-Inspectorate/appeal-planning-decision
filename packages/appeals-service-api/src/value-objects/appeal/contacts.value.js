class AppealContactsValueObject {
	#appellant;
	#agent;

	/**
	 *
	 * @param {AppealContactValueObject} appellant
	 * @param {AppealContactValueObject} agent
	 */
	constructor(appellant, agent) {
		this.#appellant = appellant;
		this.#agent = agent;
	}

	getAppellant() {
		return this.#appellant;
	}

	getAgent() {
		return this.#agent;
	}
}

module.exports = AppealContactsValueObject;
