const { SecureCodeEntity } = require ('../entities/secure-code-entity');
const { Model } = require('../model');

class FinalCommentsAggregate extends Model {

	/**
	 * When called, a {@link SecureCodeEntity} will be created internal to the instance.
	 * 
	 * @param {string} caseReference 
	 * @param {string} appellantEmail 
	 * 
	 * @return {FinalCommentsAggregate}
	 */
	constructor(caseReference, appellantEmail, secureCode = new SecureCodeEntity()) {
		super();
		this.caseReference = caseReference;
		this.appellantEmail = appellantEmail;
		this.secureCode = secureCode;
	}

	/**
	 * 
	 * @returns {SecureCodeEntity}
	 */
	getSecureCode() {
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