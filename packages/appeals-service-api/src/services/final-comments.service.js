const logger = require('../lib/logger');
const { HorizonGateway } = require('../gateway/horizon-gateway');
const { FinalCommentsAggregate } = require('../models/aggregates/final-comments-aggregate');
const { FinalCommentsRepository } = require('../repositories/final-comments-repository');
const { sendSaveAndReturnEnterCodeIntoServiceEmail } = require('../lib/notify');
const { FinalCommentsNotEnabledError } = require('../errors/final-comments/final-comments-not-enabled-error')
const { FinalCommentsWindowNotOpenError } = require ('../errors/final-comments/final-comments-window-not-open-error')

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
	 * @returns
	 */
	async sendSecureCodeForFinalComment(caseReference) {
		const finalCommentsFound = await this.#finalCommentsRepository.getByCaseReference(caseReference);
		if (finalCommentsFound == null) {
			logger.info(`Final comments not found for appeal with case reference ${caseReference}.`)
			throw new FinalCommentsNotEnabledError(caseReference);
		}

		const finalCommentsDueDate = await this.#horizonGateway.getFinalCommentsDueDate(caseReference);
		if (
			finalCommentsDueDate == undefined ||
			new Date().valueOf() >= finalCommentsDueDate.valueOf()
		) {
			logger.info(`Final comments window is not open for appeal with case reference ${caseReference}. End date is set to be: '${finalCommentsDueDate}'`)
			throw new FinalCommentsWindowNotOpenError();
		}

		sendSaveAndReturnEnterCodeIntoServiceEmail(
			finalCommentsFound.appellantEmail,
			finalCommentsFound.secureCode.pin,
			finalCommentsFound.caseReference
		);
	}
}

module.exports = { FinalCommentsService }