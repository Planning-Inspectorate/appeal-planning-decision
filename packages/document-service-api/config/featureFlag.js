const { AppConfigurationClient } = require('@azure/app-configuration');
const getAsyncLocalStorage = require('./asyncLocalStorage');

const connectionString =
	'Endpoint=https://pins-asc-appeals-service-dev-ukw-001.azconfig.io;Id=xbZ0-ln-s0:DSk9gGngBpWQ2wivO6nB;Secret=tMBrLU5G3geDGvVUeteY3tQXZDY7SBbCAnSwYzLg1cg=';
const appConfigClient = new AppConfigurationClient(connectionString);

const isFeatureActive = async (featureFlagName) => {
	const lpaCode = getAsyncLocalStorage().getStore().get('request').appeal.lpaCode;
	let flagName = featureFlagName.toString().trim();

	if (!flagName) {
		console.error('A feature flag key must be supplied.');
	} else {
		try {
			const result = await appConfigClient.getConfigurationSetting({
				key: `.appconfig.featureflag/${flagName}`,
				value: {
					conditions: {
						clientFilters: [
							{
								name: 'Microsoft.Targeting',
								parameters: {
									Audience: {
										Groups: [{ Name: lpaCode }]
									}
								}
							}
						]
					}
				}
			});

			if (result && typeof result === 'object') {
				console.debug('Feature: ' + JSON.parse(result.value).id, JSON.parse(result.value).enabled);
				return JSON.parse(result.value).enabled;
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	}
	return false;
};

module.exports = isFeatureActive;

// /**
//  * typeguard - for targeting client filter
//  */
// function isTargetingClientFilter(clientFilter) {
//     return (
//       clientFilter.name === "Microsoft.Targeting" &&
//       clientFilter.parameters &&
//       clientFilter.parameters["Audience"] &&
//       Array.isArray(clientFilter.parameters["Audience"]["Groups"]) &&
//       Array.isArray(clientFilter.parameters["Audience"]["Users"]) &&
//       typeof clientFilter.parameters["Audience"]["DefaultRolloutPercentage"] === "number"
//     );
//   }

//   main().catch((err) => {
//     console.error("Failed to run sample:", err);
//     process.exit(1);
//   });
