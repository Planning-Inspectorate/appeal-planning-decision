const { AppConfigurationClient } = require('@azure/app-configuration');
const getAsyncLocalStorage = require('./asyncLocalStorage');

const connectionString =
	'Endpoint=https://pins-asc-appeals-service-dev-ukw-001.azconfig.io;Id=xbZ0-ln-s0:DSk9gGngBpWQ2wivO6nB;Secret=tMBrLU5G3geDGvVUeteY3tQXZDY7SBbCAnSwYzLg1cg=';
const appConfigClient = new AppConfigurationClient(connectionString);

const isFeatureActive = async (featureFlagName) => {
	// TODO: grab a user/user-group identifier from this and pass it along to the
	// request sent to the feature flag server so it can target the user/user-group
	// when assessing if thefeature is active.
	const request = getAsyncLocalStorage().getStore().get('request');
	console.log(request);

	let flagName = featureFlagName.toString().trim();

	if (!flagName) {
		console.error('A feature flag key must be supplied.');
	} else {
		try {
			const result = await appConfigClient.getConfigurationSetting({
				key: `.appconfig.featureflag/${flagName}`
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
