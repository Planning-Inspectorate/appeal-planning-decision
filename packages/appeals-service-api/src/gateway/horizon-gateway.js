
const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');


class HorizonGateway {

	//TODO: this should return an as-of-yet non-existent `HorizonAppealDto` instance.
	async getAppeal(caseReference){

		logger.debug(`Getting case with reference '${caseReference}' from Horizon`)
		
		if(caseReference == false) {
			logger.debug(`No case reference specified for Horizon case retrieval`);
			return undefined;
		}

		const requestBody = {
			GetCase: {
				__soap_op: 'http://tempuri.org/IHorizon/GetCase',
				__xmlns: 'http://tempuri.org/',
				caseReference: caseReference
			}
		};

		logger.debug(`Horizon request: ${JSON.stringify(requestBody)}`);
		
		const horizonAppeal = await axios
			.post(config.services.horizon.url, requestBody)
			.catch(function (error) {
				logger.error(`Horizon responded with error ${JSON.stringify(error)}`);
			})

		if (horizonAppeal) {
			logger.debug(`Case found in Horizon: ${JSON.stringify(horizonAppeal.data)}`)
			return horizonAppeal.data;
		}

		return {};
	}
}

module.exports = { HorizonGateway }