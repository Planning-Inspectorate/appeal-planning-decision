const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const { FailedHorizonUploadRepository } = require('../repositories/failed-horizon-upload-repository')
const {
	getAppeal
} = require('./appeal.service');
const { isFeatureActive } = require('../configuration/featureFlag');

class FailedHorizonUploadService {
	#failedHorizonUploadRepository;
	#failedHorizonUploadMapper;

	constructor(){
		this.#failedHorizonUploadRepository = new FailedHorizonUploadRepository();
		this.#failedHorizonUploadMapper = new this.#failedHorizonUploadMapper();
	}

	async createFailedHorizonUpload(id){
		logger.debug(`Attempting to create failed horizon upload with appeal id ${id}`);

		let appealToSubmitToFailed = getAppeal(id);
		logger.debug(`Appeal found in repository: ${JSON.stringify(appealToSubmitToFailed)}`);
		if(appealToSubmitToFailed === null){
			throw ApiError.appealNotFound(id);
		}
		if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
			logger.debug('Using direct Horizon integration');
			const appealSubmittedToFailed = await this.#failedHorizonUploadRepository.create(appealToSubmitToFailed);
			return appealSubmittedToFailed;
		}



	}
}

module.exports = FailedHorizonUploadService;
