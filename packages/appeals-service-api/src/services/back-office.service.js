const { isFeatureActive } = require('../configuration/featureFlag');
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant
} = require('../lib/notify');
const { BackOfficeRepository } = require('../repositories/back-office-repository');
const HorizonService = require('../services/horizon.service');
const {
	getAppeal,
	saveAppealAsSubmittedToBackOffice,
} = require('./appeal.service');

class BackOfficeService {
	#horizonService;
	#backOfficeRepository;

	constructor() {
		this.#horizonService = new HorizonService();
		this.#backOfficeRepository = new BackOfficeRepository();
	}

	/**
	 * Will submit the appeal with `id` specified to the Back Office system, iff
	 *
	 * 1. The appeal with the ID specified exists in the database
	 * 2. The appeal does not have a non-blank Horizon ID
	 * 3. The appeal does not already exist in Horizon
	 *
	 * @param {string} id
	 */
	async submitAppeal(id) {
		logger.debug(`Attempting to submit appeal with ID ${id} to the back office`);

		let appealToSubmitToBackOffice = await getAppeal(id);
		logger.debug(`Appeal found in repository: ${JSON.stringify(appealToSubmitToBackOffice)}`);
		if (appealToSubmitToBackOffice === null) {
			throw ApiError.appealNotFound(id);
		}

		if (appealToSubmitToBackOffice.horizonId == undefined || appealToSubmitToBackOffice.horizonId == false) {
			let appealAfterSubmissionToBackOffice;
			if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
				logger.debug('Using direct Horizon integration');
				const horizonCaseReference = await this.#horizonService.createAppeal(appealToSubmitToBackOffice);
				appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(appealToSubmitToBackOffice, horizonCaseReference);
			} else {
				logger.debug('Using message queue integration');
				appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(appealToSubmitToBackOffice);
				this.#backOfficeRepository.create(appealAfterSubmissionToBackOffice);
			}

			await sendSubmissionConfirmationEmailToAppellant(appealAfterSubmissionToBackOffice);
			await sendSubmissionReceivedEmailToLpa(appealAfterSubmissionToBackOffice);
			return appealAfterSubmissionToBackOffice;
		}

		logger.debug('Appeal has already been submitted to the back-office');
		throw ApiError.appealAlreadySubmitted();
	}
}

module.exports = BackOfficeService;
