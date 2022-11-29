const logger = require('../lib/logger');
const { HorizonGateway } = require('../gateway/horizon-gateway');
const { DecryptionService } = require('./decryption.service');
const { FinalCommentsAggregate } = require('../models/aggregates/final-comments-aggregate');
const { FinalCommentsRepository } = require('../repositories/final-comments-repository');
const { sendSaveAndReturnEnterCodeIntoServiceEmail } = require('../lib/notify');
const {
	FinalCommentsNotEnabledError
} = require('../errors/final-comments/final-comments-not-enabled-error');
const {
	FinalCommentsWindowNotOpenError
} = require('../errors/final-comments/final-comments-window-not-open-error');
const {
	FinalCommentsSecureCodeExpired
} = require('../errors/final-comments/final-comments-secure-code-expired');
const {
	FinalCommentSecureCodeIncorrectError
} = require('../errors/final-comments/final-comments-secure-code-incorrect-error');

class FinalCommentsService {
	#finalCommentsRepository;
	#horizonGateway;
	#decryptionService;

	constructor() {
		this.#finalCommentsRepository = new FinalCommentsRepository();
		this.#horizonGateway = new HorizonGateway();
		this.#decryptionService = new DecryptionService();
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
		const finalCommentsFound = await this.#retrieveFinalCommentOrThrowErrorIfNotFound(
			caseReference
		);
		await this.#checkFinalCommentWindowAndThrowErrorIfNotOpen(caseReference);

		sendSaveAndReturnEnterCodeIntoServiceEmail(
			finalCommentsFound.getAppellantEmail(),
			finalCommentsFound.getSecureCode().getPin(),
			finalCommentsFound.getCaseReference()
		);
	}

	/**
	 * @param {string} caseReference
	 * @param {string} encryptedSecureCode
	 */
	async getFinalComment(caseReference, encryptedSecureCode) {
		const finalCommentsFound = await this.#retrieveFinalCommentOrThrowErrorIfNotFound(
			caseReference
		);
		await this.#checkFinalCommentWindowAndThrowErrorIfNotOpen(caseReference);

		if (new Date().valueOf() > finalCommentsFound.getSecureCode().getExpiration()) {
			throw new FinalCommentsSecureCodeExpired();
		}

		let decryptedSecureCode =
			this.#decryptionService.decryptFinalCommentsSecureCode(encryptedSecureCode);
		if (decryptedSecureCode !== finalCommentsFound.getSecureCode().getPin()) {
			throw new FinalCommentSecureCodeIncorrectError();
		}
	}

	async #retrieveFinalCommentOrThrowErrorIfNotFound(caseReference) {
		const finalCommentsFound = await this.#finalCommentsRepository.getByCaseReference(
			caseReference
		);
		if (finalCommentsFound == null) {
			logger.info(`Final comments not found for appeal with case reference ${caseReference}.`);
			throw new FinalCommentsNotEnabledError(caseReference);
		}
		return finalCommentsFound;
	}

	async #checkFinalCommentWindowAndThrowErrorIfNotOpen(caseReference) {
		const finalCommentsDueDate = await this.#horizonGateway.getFinalCommentsDueDate(caseReference);
		if (
			finalCommentsDueDate == undefined ||
			new Date().valueOf() >= finalCommentsDueDate.valueOf()
		) {
			logger.info(
				`Final comments window is not open for appeal with case reference ${caseReference}. End date is set to be: '${finalCommentsDueDate}'`
			);
			throw new FinalCommentsWindowNotOpenError();
		}
	}
}

module.exports = { FinalCommentsService };
