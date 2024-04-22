class BackOfficeSubmissionEntity {
	#id;
	#backOfficeId;
	#failures;

	/**
	 *
	 * @param {String} id Some identifier for the entity.
	 * @param {String} backOfficeId The ID that maps the entity identified by the `id` parameter
	 * to its representation in the back-office.
	 * @param {Array} failures Array of objects formatted as {reason: ..., datetime: ...}
	 */
	constructor(id, backOfficeId, failures = []) {
		this.#id = id;
		this.#backOfficeId = backOfficeId;
		this.#failures = failures;
	}

	getId() {
		return this.#id;
	}

	/**
	 * @param {boolean} getShortRef - attempts to retrieve final section of id after the last '/' used for horizon appeal refs
	 * @returns {string|null|undefined}
	 */
	getBackOfficeId(getShortRef = false) {
		// case IDs are in format APP/W4705/D/21/3218521 - we need the characters after the final slash
		if (getShortRef) return this.#backOfficeId?.split('/').slice(-1).pop();

		return this.#backOfficeId;
	}

	getFailures() {
		return this.#failures;
	}

	hasMaximumFailures() {
		return Object.keys(this.#failures).length >= 3;
	}

	isPending() {
		return this.#backOfficeId == null;
	}

	toJSON() {
		return { id: this.#id, backOfficeId: this.#backOfficeId, failures: this.#failures };
	}
}

module.exports = BackOfficeSubmissionEntity;
