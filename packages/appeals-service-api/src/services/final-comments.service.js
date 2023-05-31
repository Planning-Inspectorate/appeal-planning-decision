const { FinalCommentsRepository } = require('../repositories/final-comments-repository');
const ApiError = require('../errors/apiError');
const HorizonService = require('./horizon.service');
const { getAppealByHorizonId } = require('./appeal.service');
const logger = require('../lib/logger');

class FinalCommentsService {
	#finalCommentsRepository;
	#horizonService;

	constructor() {
		this.#finalCommentsRepository = new FinalCommentsRepository();
		this.#horizonService = new HorizonService();
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

	async getFinalCommentData(caseReference) {
		let caseData = await this.#horizonService.getAppealDataFromHorizon(caseReference);
		if (!caseData) {
			throw ApiError.caseDataNotFound();
		}
		const attributes = caseData.Metadata.Attributes;
		if (attributes.length === 0) {
			throw ApiError.caseDataNotFound();
		}
		// Getting final comment due date (from horizon)
		let finalCommentsDueDate = await this.#horizonService.findValueFromMetadata(
			attributes,
			'Case Document Dates:Final Comments Due Date'
		);
		logger.info('Due Date');
		logger.info(finalCommentsDueDate);
		if (!finalCommentsDueDate) {
			throw ApiError.caseHasNoFinalCommentsExpiryDate();
		}

		// Getting contact details (from local database)
		// email was moved from appeal.contactDetailsSection.contact.email
		// to appeal.email at some point during development
		let localAppealData = await getAppealByHorizonId(caseReference).catch((error) => {
			logger.error(error, 'error when fetching appeal by horizon Id');
			throw ApiError.appealNotFoundHorizonId(caseReference);
		});

		let appellantEmail =
			localAppealData.email ?? localAppealData.contactDetailsSection.contact.email;

		const finalCommentData = {
			horizonId: caseReference,
			state: 'DRAFT',
			finalCommentExpiryDate: new Date(Date.parse(finalCommentsDueDate)),
			email: appellantEmail,
			finalCommentSubmissionDate: null,
			hasComment: null,
			doesNotContainSensitiveInformation: null,
			finalComment: null,
			finalCommentAsDocument: {
				uploadedFile: {
					name: null,
					id: null
				}
			},
			hasSupportingDocuments: false,
			typeOfUser: 'Appellant/Agent',
			supportingDocuments: {
				uploadedFiles: []
			}
		};

		return finalCommentData;
	}
}

module.exports = { FinalCommentsService };
