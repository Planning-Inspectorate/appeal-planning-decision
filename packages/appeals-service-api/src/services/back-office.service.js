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

		let savedAppeal = await getAppeal(id);
		logger.debug(`Appeal found in repository: ${JSON.stringify(savedAppeal)}`);
		if (savedAppeal === null) {
			throw ApiError.appealNotFound(id);
		}

		if (savedAppeal.horizonId == undefined || savedAppeal.horizonId == false) {
			let updatedAppeal;
			if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
				logger.debug('Using direct Horizon integration');
				this.#horizonService.createAppeal(savedAppeal);
			} else {
				logger.debug('Using message queue integration');
				updatedAppeal = await saveAppealAsSubmittedToBackOffice(savedAppeal);
				this.#backOfficeRepository.create(updatedAppeal);
			}

			await sendSubmissionConfirmationEmailToAppellant(updatedAppeal);
			await sendSubmissionReceivedEmailToLpa(updatedAppeal);
			return updatedAppeal;
		}

		logger.debug('Appeal has already been submitted to the back-office');
		throw ApiError.appealAlreadySubmitted();
	}
}

module.exports = BackOfficeService;
