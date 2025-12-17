const {
	ForManualInterventionRepository
} = require('../repositories/for-manual-intervention-repository');
const ApiError = require('../errors/apiError');
const logger = require('../lib/logger.js');

class ForManualInterventionService {
	#forManualInterventionRepository;

	constructor() {
		this.#forManualInterventionRepository = new ForManualInterventionRepository();
	}
	/**
	 *
	 * @param {BackOfficeAppealSubmissionAggregate} appealSubmission
	 * @returns
	 */
	async createAppealForManualIntervention(appealSubmission) {
		await this.#forManualInterventionRepository.createAppealForManualIntervention(appealSubmission);
	}

	async getAppealForManualIntervention(id) {
		logger.info(`Retrieving appeal ${id} ...`);
		const document =
			await this.#forManualInterventionRepository.getAppealForManualInterventionById(id);

		if (document === null) {
			logger.info(`Appeal ${id} not found`);
			throw ApiError.appealNotFound(id);
		}

		logger.info(`Appeal ${id} retrieved`);
		return document;
	}

	async getAllAppealsForManualIntervention() {
		logger.info(`Retrieving appeals...`);
		const documents = await this.#forManualInterventionRepository.getAppealsForManualIntervention();

		if (documents === null) {
			logger.info(`Appeals not found`);
			throw ApiError.appealsNotFound();
		}
		logger.info(`Appeals retrieved`);
		return documents;
	}
}

module.exports = ForManualInterventionService;
