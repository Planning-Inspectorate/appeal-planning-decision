const { SecureCodeEntity } = require ('../entities/secure-code-entity');
const { Model } = require('../model');

class FinalCommentsAggregate extends Model {
	// caseReference;
	// appellantEmail;
	// secureCode;

	/**
	 * When called, a {@link SecureCodeEntity} will be created internal to the instance.
	 * 
	 * @param {string} caseReference 
	 * @param {string} appellantEmail 
	 * 
	 * @return {FinalCommentsAggregate}
	 */
	constructor(caseReference, appellantEmail) {
		super();
		this.caseReference = caseReference;
		this.appellantEmail = appellantEmail;
		this.secureCode = new SecureCodeEntity();
	}

	/**
	 * 
	 * @returns {SecureCodeEntity}
	 */
	getSecureCodeEntity() {
		return this.secureCode;
	}

	/**
	 * 
	 * @returns {string}
	 */
	getCaseReference(){
		return this.caseReference
	}

	/**
	 * 
	 * @returns {string}
	 */
	getAppellantEmail(){
		return this.appellantEmail;
	}
}

module.exports = { FinalCommentsAggregate }