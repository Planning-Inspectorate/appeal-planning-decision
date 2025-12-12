const logger = require('../lib/logger.js');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionFollowUpEmailToAppellant,
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

	/**
	 * Submit appeals to Horizon
	 *
	 * @returns {Promise<{completed: number, uncompleted: number, failures: number, errors: Object<string, *>}>}
	 */
	async submitAppeals() {
		try {
			const completedAppealSubmissions = [];
			const uncompletedAppealSubmissions = [];
			let failures = 0;
			/** @type {Object<string, *>} */
			const errors = {};
			const backOfficeSubmissions = await this.#backOfficeRepository.getAppealsForSubmission();

			for (const backOfficeSubmission of backOfficeSubmissions) {
				// try/catch for each submission so submissions aren't 'blocked' by a failing submission
				try {
					const { complete, failed, submission } = await this.submitAppeal(backOfficeSubmission);
					if (complete) {
						completedAppealSubmissions.push(submission.getId());
					} else if (!failed) {
						uncompletedAppealSubmissions.push(submission);
					} else {
						failures++;
					}
				} catch (error) {
					logger.error(error, `error submitting ${backOfficeSubmission.getId()}`);
					errors[backOfficeSubmission.getId()] = error;
				}
			}

			if (completedAppealSubmissions.length > 0) {
				try {
					await this.#backOfficeRepository.deleteAppealSubmissions(completedAppealSubmissions);
				} catch (error) {
					logger.error(error, `error deleting completed submissions`);
					errors['deletingCompleted'] = error;
				}
			}

			if (uncompletedAppealSubmissions.length > 0) {
				try {
					await this.#backOfficeRepository.updateAppealSubmissions(uncompletedAppealSubmissions);
				} catch (error) {
					logger.error(error, `error updating uncompleted submissions`);
					errors['updatingUncompleted'] = error;
				}
			}
			return {
				completed: completedAppealSubmissions.length,
				uncompleted: uncompletedAppealSubmissions.length,
				failures,
				errors
			};
		} catch (error) {
			logger.debug(error, `Error processing`);
			throw error;
		}
	}

	/**
	 * @param {*} backOfficeSubmission
	 * @returns {Promise<{complete: boolean, failed: boolean, submission: *}>}
	 */
	async submitAppeal(backOfficeSubmission) {
		const id = backOfficeSubmission.getAppealId();
		logger.debug(`Attempting to submit appeal with ID ${id} to the back office`);
		let appealToSubmitToBackOffice = await getAppeal(id);

		const updatedBackOfficeSubmission = await this.#horizonService.submitAppeal(
			appealToSubmitToBackOffice,
			backOfficeSubmission
		);

		let complete = false;
		let failed = false;

		if (updatedBackOfficeSubmission.isComplete()) {
			const appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(
				appealToSubmitToBackOffice,
				updatedBackOfficeSubmission.getAppealBackOfficeId(true),
				updatedBackOfficeSubmission.getAppealBackOfficeId(false)
			);
			await sendSubmissionReceivedEmailToLpa(appealAfterSubmissionToBackOffice);
			await sendSubmissionFollowUpEmailToAppellant(appealAfterSubmissionToBackOffice);
			complete = true;
		} else if (updatedBackOfficeSubmission.someEntitiesHaveMaximumFailures()) {
			// after a certain number of failures, remove the submission from the queue and send a notification (email)
			await sendFailureToUploadToHorizonEmail(id);
			await this.#forManualInterventionService.createAppealForManualIntervention(
				updatedBackOfficeSubmission
			);
			await this.#backOfficeRepository.deleteAppealSubmission(updatedBackOfficeSubmission.getId());
			failed = true;
		}
		logger.debug({ complete, failed }, 'appeal submission status');
		return { complete, failed, submission: updatedBackOfficeSubmission };
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
