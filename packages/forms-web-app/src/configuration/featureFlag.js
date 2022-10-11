const { AppConfigurationClient } = require('@azure/app-configuration');
const config = require('../config');
const logger = require('../lib/logger');

const appConfigClient = new AppConfigurationClient(config.featureFlagging.endpoint);
const cacheTimeToLiveInMinutes = config.featureFlagging.timeToLiveInMinutes;
let featureFlagCache = {};

const isFeatureActive = async (featureFlagName, localPlanningAuthorityCode) => {
	let flagName = featureFlagName.toString().trim();

	if (!flagName) {
		console.error('A feature flag key must be supplied.');
		return false;
	}

	if (
		featureFlagCache[featureFlagName] === undefined ||
		Date.now() >= featureFlagCache[featureFlagName].timeToLive
	) {
		try {
			const result = await appConfigClient.getConfigurationSetting({
				key: `.appconfig.featureflag/${flagName}`
			});

			if (result && typeof result === 'object') {
				const parsedResult = JSON.parse(result.value);
				featureFlagCache[featureFlagName] = parsedResult;
				featureFlagCache.timeToLive = Date.now() + cacheTimeToLiveInMinutes * 60000;
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	const result = featureFlagCache[featureFlagName];
	const userGroup = result.conditions.client_filters[0].parameters.Audience.Users;
	const isUserInUserGroup = userGroup.includes(localPlanningAuthorityCode);
	logger.debug('Feature flag: ' + result.id, result.enabled);
	logger.debug('Is local planning authority code in feature flag user group: ' + isUserInUserGroup);
	return result.enabled && isUserInUserGroup;
};

module.exports = { isFeatureActive };
