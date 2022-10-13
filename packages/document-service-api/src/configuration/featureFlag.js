const { AppConfigurationClient } = require('@azure/app-configuration');
const config = require('./config');
const logger = require('../lib/logger');

const appConfigClient = new AppConfigurationClient(config.featureFlagging.endpoint);
const cacheTimeToLiveInMinutes = config.featureFlagging.timeToLiveInMinutes;
let featureFlagCache = {};

const isFeatureActive = async (featureFlagName, localPlanningAuthorityCode) => {
	let flagName = featureFlagName.toString().trim();

	logger.info(`Retrieving configuration for feature flag with name '${flagName}'`);

	if (!flagName) {
		logger.error('A feature flag key must be supplied.');
		return false;
	}

	logger.info(`--- Feature flag cache pre-cache check ---`);
	logger.info(featureFlagCache);
	logger.info(`--------------------------`);

	if (
		featureFlagCache[featureFlagName] === undefined ||
		Date.now() >= featureFlagCache[featureFlagName].timeToLive
	) {
		logger.info('Retrieving feature flag configuration from Azure');
		try {
			const azureFeatureFlagConfiguration = await appConfigClient.getConfigurationSetting({
				key: `.appconfig.featureflag/${flagName}`
			});

			if (azureFeatureFlagConfiguration && typeof azureFeatureFlagConfiguration === 'object') {
				logger.info(`Retrieved valid feature flag configuration, updating cache...`);
				featureFlagCache[featureFlagName] = JSON.parse(azureFeatureFlagConfiguration.value);
				featureFlagCache.timeToLive = Date.now() + cacheTimeToLiveInMinutes * 60000;
			} else {
				logger.info(`Retrieved invalid feature flag configuration; retrieved value follows...`);
				logger.info(azureFeatureFlagConfiguration);
			}
		} catch (error) {
			logger.error(error);
			return false;
		}
	}

	logger.info(`--- Feature flag cache post-cache check---`);
	logger.info(featureFlagCache);
	logger.info(`--------------------------`);

	const featureFlagConfiguration = featureFlagCache[featureFlagName];
	const userGroup = featureFlagConfiguration.conditions.client_filters[0].parameters.Audience.Users;
	const isUserInUserGroup = userGroup.includes(localPlanningAuthorityCode);
	logger.info('Feature flag: ' + featureFlagConfiguration.id, featureFlagConfiguration.enabled);
	logger.info('Is local planning authority code in feature flag user group: ' + isUserInUserGroup);
	return featureFlagConfiguration.enabled && isUserInUserGroup;
};

module.exports = { isFeatureActive };
