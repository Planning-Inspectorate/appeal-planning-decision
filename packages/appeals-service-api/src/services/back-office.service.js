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
		const appealToSaveForSubmission = await getAppeal(appeal_id);
		const appealContactDetails = getContactDetails(appealToSaveForSubmission);
		const appealDocumentIds = getDocumentIds(appealToSaveForSubmission);
		await this.#backOfficeRepository.saveAppealForSubmission(appealContactDetails, appeal_id, appealDocumentIds)
	}

	async submitAppeals() {
		const backOfficeSubmissions = await this.#backOfficeRepository.getAppealsForSubmission();
		for (const backOfficeSubmission of backOfficeSubmissions) {
			const id = backOfficeSubmission.getAppealId()
			logger.debug(`Attempting to submit appeal with ID ${id} to the back office`);

			let appealToSubmitToBackOffice = await getAppeal(id);
			logger.debug(`Appeal found in repository: ${JSON.stringify(appealToSubmitToBackOffice)}`);

			if (appealToSubmitToBackOffice.horizonId == undefined || appealToSubmitToBackOffice.horizonId == false) {
				let appealAfterSubmissionToBackOffice;
				if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
					logger.debug('Using direct Horizon integration');
					const horizonCaseReference = await this.#horizonService.submitAppeal(appealToSubmitToBackOffice);
					appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(appealToSubmitToBackOffice, horizonCaseReference);
				} else {
					logger.debug('Using message queue integration');
					appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(appealToSubmitToBackOffice);
					this.#backOfficeRepository.create(appealAfterSubmissionToBackOffice);
				}

				await sendSubmissionConfirmationEmailToAppellant(appealAfterSubmissionToBackOffice);
				await sendSubmissionReceivedEmailToLpa(appealAfterSubmissionToBackOffice);
			}

			logger.debug('Appeal has already been submitted to the back-office');
		}

		return;
	}
}

module.exports = BackOfficeService;
