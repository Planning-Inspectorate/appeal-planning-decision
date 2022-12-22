const logger = require('../lib/logger');
const HorizonService = require('./horizon.service');
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
	#horizonService;
	#decryptionService;

	constructor() {
		this.#finalCommentsRepository = new FinalCommentsRepository();
		this.#horizonService = new HorizonService();
		this.#decryptionService = new DecryptionService();
	}

	/**
	 *
	 * @param {string} caseReference
	 * @param {string} appellantEmail
	 * @returns {Promise<boolean>}
	 */
	async createFinalComments(caseReference, appellantEmail) {
		logger.debug(`Attempting to create final comment with case reference ${caseReference}`)
		const finalCommentWithCaseReference = await this.#finalCommentsRepository.getByCaseReference(
			caseReference
		);
		if (finalCommentWithCaseReference) {
			logger.debug(`A final comment with case reference ${caseReference} already exists`)
			return false;
		}

		logger.debug(`No final comment with case reference ${caseReference} exisits, creating an entity in the repository`)
		const finalCommentsToSave = new FinalCommentsAggregate(caseReference, appellantEmail);
		logger.debug(finalCommentsToSave, 'Final comment entity to create')
		await this.#finalCommentsRepository.create(finalCommentsToSave);
		logger.debug(`Created final comment`)
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
			logger.debug(`Final comments not found for appeal with case reference ${caseReference}.`);
			throw new FinalCommentsNotEnabledError(caseReference);
		}
		return finalCommentsFound;
	}

	async #checkFinalCommentWindowAndThrowErrorIfNotOpen(caseReference) {
	
		const finalCommentsDueDate = await this.#horizonService.getFinalCommentsDueDate(caseReference);

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
