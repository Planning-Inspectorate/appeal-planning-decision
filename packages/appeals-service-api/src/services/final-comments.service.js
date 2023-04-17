const { FinalCommentsRepository } = require('../repositories/final-comments-repository');
const ApiError = require('../errors/apiError');
const BackOfficeService = require('./back-office.service');
const logger = require('../lib/logger');

class FinalCommentsService {
	#finalCommentsRepository;
	#backOfficeService;

	constructor() {
		this.#finalCommentsRepository = new FinalCommentsRepository();
		this.#backOfficeService = new BackOfficeService();
	}

	async createFinalComment(finalComment) {
		//Check if already submitted
		let submittedFinalComments =
			await this.#finalCommentsRepository.getAllFinalCommentsByCaseReference(
				finalComment.horizonId.toString()
			);
		if (submittedFinalComments.length > 0) {
			logger.info(
				`An appeal for HorizonId ${finalComment.horizonId} already exists. Checking Email is unique`
			);
			for (const submittedFinalComment of submittedFinalComments) {
				if (submittedFinalComment.finalComment.email === finalComment.email) {
					logger.info(
						`An appeal for HorizonId ${finalComment.horizonId} and ${finalComment.email} already exists.`
					);
					throw ApiError.finalCommentAlreadySubmitted();
				}
			}
		}
		// Check that we are in date
		let now = new Date(new Date().toISOString());
		let expiry = new Date(finalComment.finalCommentExpiryDate);
		if (expiry < now) {
			throw ApiError.finalCommentHasExpired();
		}

		// Set required final comment data
		let finalCommentToSave = { finalComment: { ...finalComment } };

		finalCommentToSave.finalComment.finalCommentSubmissionDate = now;
		finalCommentToSave.finalComment.typeOfUser = finalCommentToSave.finalComment.typeOfUser
			? finalCommentToSave.finalComment.typeOfUser
			: 'Appellant/Agent';
		finalCommentToSave.finalComment.horizonId = finalComment.horizonId.toString();

		//Create final comment in Mongo
		let document = await this.#finalCommentsRepository.create(finalCommentToSave);
		logger.info(document.result);

		return document;
	}

	async getFinalComment(caseReference) {
		let submittedFinalComments =
			await this.#finalCommentsRepository.getAllFinalCommentsByCaseReference(caseReference);

		if (submittedFinalComments.length > 0) {
			let formattedFinalComments = [];
			submittedFinalComments.forEach((finalComment) =>
				formattedFinalComments.push({ ...finalComment })
			);
			return formattedFinalComments;
		} else {
			throw ApiError.finalCommentsNotFound();
		}
	}
}

module.exports = { FinalCommentsService };
