const { HorizonGateway } = require('../gateway/horizon-gateway');
const { FinalCommentsAggregate } = require('../models/aggregates/final-comments-aggregate');
const { FinalCommentsRepository } = require('../repositories/final-comments-repository');
const { sendSaveAndReturnEnterCodeIntoServiceEmail } = require('../lib/notify');

class FinalCommentsService {
	#finalCommentsRepository;
	#horizonGateway;

	constructor() {
		this.#finalCommentsRepository = new FinalCommentsRepository();
		this.#horizonGateway = new HorizonGateway();
	}

	/**
	 * 
	 * @param {string} caseReference 
	 * @param {string} appellantEmail 
	 * @returns {Promise<boolean>}
	 */
	async createFinalComments(caseReference, appellantEmail) {
		const finalCommentWithCaseReference = await this.#finalCommentsRepository.getByCaseReference(
			caseReference
		);
		if (finalCommentWithCaseReference) {
			return false;
		}

		const finalCommentsToSave = new FinalCommentsAggregate(caseReference, appellantEmail);
		await this.#finalCommentsRepository.create(finalCommentsToSave);
		return true;
	}

	/**
	 * 
	 * @param {string} caseReference 
	 * @returns {Promise<boolean>}
	 */
	async checkFinalCommentExists(caseReference) {
		const finalCommentsFound = await this.#finalCommentsRepository.getByCaseReference(caseReference);
		if (finalCommentsFound == null) {
			return false;
		}

		const finalCommentsDueDate = await this.#horizonGateway.getFinalCommentsDueDate(caseReference);
		if (
			finalCommentsDueDate == undefined ||
			new Date().valueOf() >= finalCommentsDueDate.valueOf()
		) {
			return false;
		}

		sendSaveAndReturnEnterCodeIntoServiceEmail(
			finalCommentsFound.appellantEmail,
			finalCommentsFound.secureCode.pin,
			finalCommentsFound.caseReference
		);
		return true;
	}
}

module.exports = { FinalCommentsService }