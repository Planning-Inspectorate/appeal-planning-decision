const isFeatureActive = async (featureFlagName, localPlanningAuthorityCode) => {
	if (process.env.FEATURE_FLAGS_SETTING == 'ALL_ON') {
		return true;
	}

	//if no env variable pointing to the config in azure, early return to avoid issues.
	const config = require('./config');
	const endpoint = config?.featureFlagging?.endpoint;

	if (!endpoint || typeof endpoint !== 'string' || endpoint.length <= 1) {
		return false;
	}

	const { AppConfigurationClient } = require('@azure/app-configuration');
	const logger = require('../lib/logger');

	const appConfigClient = new AppConfigurationClient(config.featureFlagging.endpoint);
	const cacheTimeToLiveInMinutes = config.featureFlagging.timeToLiveInMinutes;
	let featureFlagCache = {};

	let flagName = featureFlagName.toString().trim();

	logger.info(`Retrieving configuration for feature flag with name '${flagName}'`);

	if (!flagName) {
		logger.error('A feature flag key must be supplied.');
		return false;
	}

	logger.info('Feature flag cache pre-cache check:', featureFlagCache);

	const currentTime = Date.now();
	const timeToLive = featureFlagCache[flagName]?.timeToLive;

	logger.info('Current time: ' + currentTime + '// Time to live: ' + timeToLive);

	const timeToLiveEvaluation = currentTime >= timeToLive;

	logger.info('Time to live evaluation: ' + timeToLiveEvaluation);

	if (featureFlagCache[flagName] === undefined || timeToLiveEvaluation) {
		logger.info('Retrieving feature flag configuration from Azure');
		try {
			const azureFeatureFlagConfiguration = await appConfigClient.getConfigurationSetting({
				key: `.appconfig.featureflag/${flagName}`
			});

			if (azureFeatureFlagConfiguration && typeof azureFeatureFlagConfiguration === 'object') {
				logger.info(`Retrieved valid feature flag configuration, updating cache...`);
				featureFlagCache[flagName] = JSON.parse(azureFeatureFlagConfiguration.value);
				featureFlagCache[flagName].timeToLive = Date.now() + cacheTimeToLiveInMinutes * 60000;
			} else {
				logger.info(`Retrieved invalid feature flag configuration; retrieved value follows...`);
				logger.info(azureFeatureFlagConfiguration);
			}
		} catch (error) {
			logger.error(error);
			return false;
		}
	}

	logger.info('Feature flag cache post-cache check:', featureFlagCache);

	const featureFlagConfiguration = featureFlagCache[flagName];
	const userGroup = featureFlagConfiguration.conditions.client_filters[0].parameters.Audience.Users;
	const isUserInUserGroup =
		(Array.isArray(userGroup) && !userGroup.length) ||
		userGroup.includes(localPlanningAuthorityCode);
	logger.info(
		'Feature flag: ' + featureFlagConfiguration.id + ' ' + featureFlagConfiguration.enabled
	);
	logger.info('Is local planning authority code in feature flag user group: ' + isUserInUserGroup);
	return featureFlagConfiguration.enabled && isUserInUserGroup;
};

module.exports = { isFeatureActive };
