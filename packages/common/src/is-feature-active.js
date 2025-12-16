/**
 * @param {string} featureFlagName
 */
function isLocalOverride(featureFlagName) {
	const localFeatureFlagPrefix = 'LOCAL_FEATURE_FLAG_';

	// If not a LOCAL_FEATURE_FLAG then use ALL_ON setting
	if (
		process.env.FEATURE_FLAGS_SETTING === 'ALL_ON' &&
		!featureFlagName.startsWith(localFeatureFlagPrefix)
	) {
		return true;
	}

	// Check for local feature flag overrides
	const envVarName = `LOCAL_FEATURE_FLAG_${featureFlagName.toUpperCase().replace(/-/g, '_')}`;
	return process.env[envVarName] === 'true';
}

/**
 * @param {{ endpoint?: string, timeToLiveInMinutes: string | number }} [options]
 * @returns {(featureFlagName: string, localPlanningAuthorityCode?: string) => Promise<boolean>}
 */
exports.isFeatureActive = (options) => async (featureFlagName, localPlanningAuthorityCode) => {
	if (isLocalOverride(featureFlagName)) {
		return true;
	}

	//if no env variable pointing to the config in azure, early return to avoid issues.
	if (!options?.endpoint || typeof options.endpoint !== 'string' || options.endpoint.length <= 1) {
		return false;
	}

	const { AppConfigurationClient } = require('@azure/app-configuration');
	const logger = require('./lib/logger');

	const appConfigClient = new AppConfigurationClient(options.endpoint);
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
				featureFlagCache[flagName].timeToLive =
					Date.now() + Number(options.timeToLiveInMinutes) * 60000;
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
