const { AppConfigurationClient } = require('@azure/app-configuration');
const logger = require('./lib/logger');
const { getOrSetCache } = require('./lib/memory-cache');
const { retryAsync } = require('./lib/retry-async');

const retryDelayMs = 100;
const retryAttempts = 3;
const msIn1Minute = 60000;

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
 * @param {{ endpoint?: string, timeToLiveInMinutes: string | number }} options
 * @returns {(featureFlagName: string, localPlanningAuthorityCode?: string) => Promise<boolean>}
 */
exports.isFeatureActive = (options) => async (featureFlagName, localPlanningAuthorityCode) => {
	if (!featureFlagName || typeof featureFlagName !== 'string' || featureFlagName === '') {
		throw new Error('isFeatureActive: featureFlagName is required');
	}

	let ttlMinutes = options?.timeToLiveInMinutes;
	if (typeof ttlMinutes === 'string') {
		ttlMinutes = parseInt(ttlMinutes, 10);
		if (isNaN(ttlMinutes)) {
			throw new Error('isFeatureActive: timeToLiveInMinutes must be a valid number');
		}
	}
	if (typeof ttlMinutes !== 'number' || ttlMinutes < 0) {
		throw new Error('isFeatureActive: timeToLiveInMinutes must be a positive number');
	}

	if (isLocalOverride(featureFlagName)) {
		return true;
	}

	// For local use, sets all features on for development
	if (process.env.FEATURE_FLAGS_SETTING === 'ALL_ON') {
		return true;
	}

	if (!options || typeof options.endpoint !== 'string' || options.endpoint === '') {
		throw new Error('isFeatureActive: AppConfigurationClient endpoint is required');
	}

	const getFlag = async () =>
		getFeatureFlag(
			/** @ts-ignore type checked above */
			options.endpoint,
			featureFlagName
		);
	const logRetryAttempt = (/** @type {any} */ error, /** @type {number} */ attempt) =>
		logger.warn(error, `error retrieving flag '${featureFlagName}' (retry ${attempt})`);

	const featureFlagConfiguration = await getOrSetCache(
		`featureFlag-${featureFlagName}`,
		() => retryAsync(getFlag, retryDelayMs, retryAttempts, logRetryAttempt),
		ttlMinutes * msIn1Minute
	);

	if (!featureFlagConfiguration || typeof featureFlagConfiguration !== 'object') {
		logger.error(`Feature flag '${featureFlagName}' missing or invalid after retrieval.`);
		return false;
	}

	const clientFilters = featureFlagConfiguration.conditions?.client_filters;
	const audience = clientFilters?.[0]?.parameters?.Audience;
	const userGroup = audience?.Users;
	if (!Array.isArray(userGroup)) {
		logger.warn(`Feature flag '${featureFlagName}' has no valid user group. Returning false.`);
		return false;
	}
	const isUserInUserGroup =
		userGroup.length === 0 || userGroup.includes(localPlanningAuthorityCode || '');
	return Boolean(featureFlagConfiguration.enabled && isUserInUserGroup);
};

/**
 * @typedef {Object} FeatureFlagConfiguration
 * @property {boolean} enabled - Whether the feature flag is enabled
 * @property {Object} conditions - Conditions for the feature flag
 * @property {Array<{parameters: {Audience: { Users: Array<string>}}}>} conditions.client_filters - Array of client filter objects
 */

/**
 * @param {string} endpoint
 * @param {string} flagName
 * @returns {Promise<FeatureFlagConfiguration>}
 */
const getFeatureFlag = async (endpoint, flagName) => {
	const appConfigClient = new AppConfigurationClient(endpoint);

	const azureFeatureFlagConfiguration = await appConfigClient.getConfigurationSetting({
		key: `.appconfig.featureflag/${flagName}`
	});

	if (!azureFeatureFlagConfiguration || typeof azureFeatureFlagConfiguration.value !== 'string') {
		throw new Error(`Feature flag '${flagName}' not found in Azure App Configuration`);
	}

	return JSON.parse(azureFeatureFlagConfiguration.value);
};
