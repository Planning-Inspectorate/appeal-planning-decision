const { isFeatureActive } = require('../configuration/featureFlag');
const logger = require('../lib/logger');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant
} = require('../lib/notify');
const { BackOfficeRepository } = require('../repositories/back-office-repository');
const HorizonService = require('../services/horizon.service');
const {
	getAppeal,
	getContactDetails,
	getDocumentIds,
	saveAppealAsSubmittedToBackOffice
} = require('./appeal.service');

class BackOfficeService {
	#horizonService;
	#backOfficeRepository;

	constructor() {
		this.#horizonService = new HorizonService();
		this.#backOfficeRepository = new BackOfficeRepository();
	}

	async saveAppealForSubmission(appeal_id) {
		// TODO: add a check here to ensure that the same appeal can't be submitted twice
		const appealToProcess = await getAppeal(appeal_id);
		const appealContactDetails = getContactDetails(appealToProcess);
		const appealDocumentIds = getDocumentIds(appealToProcess);
		await this.#backOfficeRepository.saveAppealForSubmission(appealContactDetails, appeal_id, appealDocumentIds)
		await sendSubmissionConfirmationEmailToAppellant(appealToProcess);
	}

	async submitAppeals() {
		let completedAppealSubmissions = [];
		let uncompletedAppealSubmissions = [];

		const backOfficeSubmissions = await this.#backOfficeRepository.getAppealsForSubmission();
		for (const backOfficeSubmission of backOfficeSubmissions) {
			const id = backOfficeSubmission.getAppealId()
			logger.debug(`Attempting to submit appeal with ID ${id} to the back office`);

			let appealToSubmitToBackOffice = await getAppeal(id);
			logger.debug(`Appeal found in repository: ${JSON.stringify(appealToSubmitToBackOffice)}`);

			if (appealToSubmitToBackOffice.horizonId == undefined || appealToSubmitToBackOffice.horizonId == false) {
				if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
					logger.debug('Using direct Horizon integration');
					const updatedBackOfficeSubmission = await this.#horizonService.submitAppeal(appealToSubmitToBackOffice, backOfficeSubmission);

					if (updatedBackOfficeSubmission.isComplete()) {
						logger.debug("Appeal submission to back office is complete")
						const appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(appealToSubmitToBackOffice, updatedBackOfficeSubmission.getAppealBackOfficeId());
						await sendSubmissionReceivedEmailToLpa(appealAfterSubmissionToBackOffice);
						completedAppealSubmissions.push(updatedBackOfficeSubmission.getId());
					} else {						
						const difference = backOfficeSubmission.difference(updatedBackOfficeSubmission);
						logger.debug(difference.toJSON(), "Appeal submission to back office is NOT complete however, the following back office IDs have been updated")
						uncompletedAppealSubmissions.push(difference);
					}

				} else {
					logger.debug('Using message queue integration');
					const appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(appealToSubmitToBackOffice);
					this.#backOfficeRepository.create(appealAfterSubmissionToBackOffice);
					completedAppealSubmissions.push(appealAfterSubmissionToBackOffice.id);
					await sendSubmissionReceivedEmailToLpa(appealAfterSubmissionToBackOffice);
				}
			}
		}

		if (completedAppealSubmissions.length > 0) {
			this.#backOfficeRepository.deleteAppealSubmissions(completedAppealSubmissions);
		}

		if (uncompletedAppealSubmissions.length > 0) {
			await this.#backOfficeRepository.updateAppealSubmissions(uncompletedAppealSubmissions);
		}

		return;
	}
}

module.exports = BackOfficeService;
