const cron = require('node-cron');
const logger = require('../lib/logger.js');
const config = require('../configuration/config');
const BackOfficeService = require('../services/back-office.service');

const backOfficeService = new BackOfficeService();
module.exports = () => {
	let submitToHorizonFrequency = '*/10 * * * *';

	const configStr = config.tasks.appealsApi.submitToHorizonCronString;
	// As this step is crucial, the task will validate the input cron string.
	// If it isn't valid it will default to every 10 mins
	if (configStr && cron.validate(configStr)) {
		submitToHorizonFrequency = configStr;
	} else {
		logger.debug('submitToHorizonCronString was invalid, defaulting to every 10 minutes');
	}

	if (config.tasks.appealsApi.runSubmitToHorizonTrigger === 'true') {
		cron.schedule(submitToHorizonFrequency, async () => {
			logger.info('running scheduled submission to horizon');
			try {
				const outcome = await backOfficeService.submitAppeals();
				if (
					outcome.failures > 0 ||
					Object.keys(outcome.errors).length > 0 ||
					outcome.uncompleted > 0
				) {
					logger.error(
						outcome,
						'scheduled submission to horizon has errored|failed|uncompleted submissions'
					);
				} else {
					logger.info(outcome, 'scheduled submission to horizon has completed successfully');
				}
			} catch (error) {
				logger.error(error, 'scheduled submission to horizon has failed');
			}
		});
	}
};
