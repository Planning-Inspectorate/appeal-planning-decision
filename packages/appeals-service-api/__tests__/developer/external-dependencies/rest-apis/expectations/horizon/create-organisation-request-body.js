const RequestBodyExpectation = require('../request-body-expectation');

module.exports = class HorizonCreateOrganisationRequestBodyExpectation extends (
	RequestBodyExpectation
) {
	organisationName;

	constructor(organisationName) {
		super(typeof organisationName == 'string' ? 8 : 9);
		this.organisationName = organisationName;
	}

	getOrganisationName() {
		return this.organisationName;
	}
};
