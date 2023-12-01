const HASH_LENGTH = 40;

// <prefix>(<scope>): <message>
// see https://www.conventionalcommits.org/en/v1.0.0/#summary
const COMMIT_WITH_SCOPE_FORMAT = /^.*\((.*)\):.*/;

// ticket numbers are of the form <board-id>-<number>
// basic regex to check if a string ends in digits
const ENDS_IN_DIGITS = /(.*)[0-9]+$/;

class Commit {
	/**
	 * @param {string} details - git log output in the form "%H; %s"
	 */
	constructor(details) {
		this.details = details;
	}

	/**
	 * @returns {string}
	 */
	get hash() {
		return this.details.substring(0, HASH_LENGTH);
	}

	/**
	 * @returns {string}
	 */
	get message() {
		return this.details.substring(HASH_LENGTH + 2); // +2 for "; "
	}

	/**
	 * @returns {boolean}
	 */
	get hasScope() {
		return Boolean(this.message.match(COMMIT_WITH_SCOPE_FORMAT));
	}

	/**
	 * @returns {string}
	 */
	get scope() {
		const match = this.message.match(COMMIT_WITH_SCOPE_FORMAT);
		return match[1].toLowerCase();
	}

	/**
	 * @returns {boolean}
	 */
	get scopeEndsInDigits() {
		return Boolean(this.scope.match(ENDS_IN_DIGITS));
	}

	/**
	 * @returns {string}
	 */
	get ticketNumber() {
		const scope = this.scope;
		return scope.includes('-') ? scope : `aapd-${scope}`;
	}
}

module.exports = {
	Commit
};
