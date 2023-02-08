const logger = require('../lib/logger');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant,
	sendFailureToUploadToHorizonEmail
} = require('../lib/notify');
const { BackOfficeRepository } = require('../repositories/back-office-repository');
const ForManualInterventionService = require('../services/for-manual-intervention.service');
const HorizonService = require('../services/horizon.service');
const {
	getAppeal,
	getContactDetails,
	getDocumentIds,
	saveAppealAsSubmittedToBackOffice
} = require('./appeal.service');
const ApiError = require('../errors/apiError');

class BackOfficeService {
	#horizonService;
	#backOfficeRepository;
	#forManualInterventionService;

	constructor() {
		this.#horizonService = new HorizonService();
		this.#backOfficeRepository = new BackOfficeRepository();
		this.#forManualInterventionService = new ForManualInterventionService();
	}

	async saveAppealForSubmission(appeal_id) {
		const appealToProcess = await getAppeal(appeal_id);

		if (appealToProcess.horizonId == undefined || appealToProcess.horizonId == false) {
			const appealContactDetails = getContactDetails(appealToProcess);
			const appealDocumentIds = getDocumentIds(appealToProcess);
			await this.#backOfficeRepository.saveAppealForSubmission(
				appealContactDetails,
				appealToProcess,
				appealDocumentIds
			);

			await sendSubmissionConfirmationEmailToAppellant(appealToProcess);
		}
	}

	async submitAppeals() {
		let completedAppealSubmissions = [];
		let uncompletedAppealSubmissions = [];
		const backOfficeSubmissions = await this.#backOfficeRepository.getAppealsForSubmission();

		for (const backOfficeSubmission of backOfficeSubmissions) {
			const id = backOfficeSubmission.getAppealId();
			logger.debug(`Attempting to submit appeal with ID ${id} to the back office`);
			let appealToSubmitToBackOffice = await getAppeal(id);

			const updatedBackOfficeSubmission = await this.#horizonService.submitAppeal(
				appealToSubmitToBackOffice,
				backOfficeSubmission
			);

			if (updatedBackOfficeSubmission.isComplete()) {
				logger.debug('Appeal submission to back office is complete');
				const appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(
					appealToSubmitToBackOffice,
					updatedBackOfficeSubmission.getAppealBackOfficeId()
				);
				await sendSubmissionReceivedEmailToLpa(appealAfterSubmissionToBackOffice);
				completedAppealSubmissions.push(updatedBackOfficeSubmission.getId());
			} else if (updatedBackOfficeSubmission.someEntitiesHaveMaximumFailures()) {
				await sendFailureToUploadToHorizonEmail(id);
				await this.#forManualInterventionService.createAppealForManualIntervention(
					updatedBackOfficeSubmission
				);
				await this.#backOfficeRepository.deleteAppealSubmission(
					updatedBackOfficeSubmission.getId()
				);
			} else {
				logger.debug('Appeal submission to back office is incomplete');
				uncompletedAppealSubmissions.push(updatedBackOfficeSubmission);
			}
		}

		if (completedAppealSubmissions.length > 0) {
			this.#backOfficeRepository.deleteAppealSubmissions(completedAppealSubmissions);
		}

		if (uncompletedAppealSubmissions.length > 0) {
			await this.#backOfficeRepository.updateAppealSubmissions(uncompletedAppealSubmissions);
		}
	}

	async getAppealForSubmission(id) {
		logger.info(`Retrieving appeal ${id} ...`);
		let document = await this.#backOfficeRepository.findOneById(id);

		logger.info(document);

		if (document === null) {
			logger.info(`Appeal ${id} not found`);
			throw ApiError.appealNotFound(id);
		}

		logger.info(`Appeal ${id} retrieved`);
		return document;
	}
}

module.exports = BackOfficeService;
