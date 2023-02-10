const cron = require('node-cron');
const logger = require('../lib/logger');
const config = require('../configuration/config');
const BackOfficeService = require('../services/back-office.service');

const backOfficeService = new BackOfficeService();
module.exports = () => {
	let submitToHorizonFrequency;
	// As this step is crucial, the task will validate the input cron string.
	// If it isn't valid it will default to every 10 mins
	if (cron.validate(config.tasks.appealsApi.submitToHorizonCronString)) {
		submitToHorizonFrequency = config.tasks.appealsApi.submitToHorizonCronString;
	} else {
		submitToHorizonFrequency = '*/10 * * * *';
		logger.debug('submitToHorizonCronString was invalid, defaulting to every 10 minutes');
	}

	if (config.tasks.appealsApi.runSubmitToHorizonTrigger) {
		cron.schedule(submitToHorizonFrequency, async () => {
			logger.info('Triggering submission to horizon');
			try {
				let outcome = await backOfficeService.submitAppeals();
				logger.debug(outcome);
				logger.info('Triggering submission to horizon ran successfully');
			} catch (error) {
				logger.info('Triggering submission to horizon failed');
				logger.debug(`Error processing: ${error}`);
			}
		});
	}
};
