const RequestBodyExpectation = require('../request-body-expectation');

module.exports = class HorizonCreateContactRequestBodyExpectation extends RequestBodyExpectation {
	email;
	firstName;
	lastName;
	organisationId;

	constructor(email, firstName, lastName, organisationId) {
		let keysToAdd = 10;
		if (typeof email !== 'string') keysToAdd++;
		if (organisationId) keysToAdd++;
		super(keysToAdd);
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.organisationId = organisationId;
	}

	getEmail() {
		return this.email;
	}

	getFirstName() {
		return this.firstName;
	}

	getLastName() {
		return this.lastName;
	}

	getOrganisationId() {
		return this.organisationId;
	}
};
