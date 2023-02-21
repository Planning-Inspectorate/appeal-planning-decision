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

	getBackOfficeId() {
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
