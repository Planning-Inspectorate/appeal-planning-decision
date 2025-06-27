class AppealContactValueObject {
	#organisationName;
	#name;
	#email;

	constructor(organisationName, name, email) {
		this.#organisationName = organisationName;
		this.#name = name;
		this.#email = email;
	}

	getOrganisationName() {
		return this.#organisationName;
	}

	getName() {
		return this.#name;
	}

	getEmail() {
		return this.#email;
	}

	toJSON() {
		return {
			organisationName: this.#organisationName,
			name: this.#name,
			email: this.#email
		};
	}
}

module.exports = AppealContactValueObject;
