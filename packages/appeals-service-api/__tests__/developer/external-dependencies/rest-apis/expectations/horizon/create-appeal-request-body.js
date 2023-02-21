const RequestBodyExpectation = require('../request-body-expectation');

module.exports = class HorizonCreateAppealRequestBodyExpectation extends RequestBodyExpectation {
	appealType;
	lpaCode;
	lpaCountry;
	caseworkReason;
	decisionDate;
	caseProcedure;
	ownershipCertificate;
	contacts;

	constructor(
		appealType,
		lpaCode,
		lpaCountry,
		caseworkReason,
		decisionDate,
		caseProcedure,
		ownershipCertificate,
		contacts
	) {
		super(71 + 24 * contacts.length);
		this.appealType = appealType;
		this.lpaCode = lpaCode;
		this.lpaCountry = lpaCountry;
		this.caseworkReason = caseworkReason;
		this.decisionDate = decisionDate;
		this.caseProcedure = caseProcedure;
		this.ownershipCertificate = ownershipCertificate;
		this.contacts = contacts;
	}

	getAppealType() {
		return this.appealType;
	}

	getLpaCode() {
		return this.lpaCode;
	}

	getLpaCountry() {
		return this.lpaCountry;
	}

	getCaseworkReason() {
		return this.caseworkReason;
	}

	getDecisionDate() {
		return this.decisionDate;
	}

	getCaseProcedure() {
		return this.caseProcedure;
	}

	getOwnershipCertificate() {
		return this.ownershipCertificate;
	}

	getContacts() {
		return this.contacts;
	}
};
