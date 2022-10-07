const { AppConfigurationClient } = require('@azure/app-configuration');
//const getAsyncLocalStorage = require('./asyncLocalStorage');

const connectionString =
	'Endpoint=https://pins-asc-appeals-service-dev-ukw-001.azconfig.io;Id=xbZ0-ln-s0:DSk9gGngBpWQ2wivO6nB;Secret=tMBrLU5G3geDGvVUeteY3tQXZDY7SBbCAnSwYzLg1cg=';
const appConfigClient = new AppConfigurationClient(connectionString);

const isFeatureActive = async (featureFlagName, user) => {
	//const lpaCode = getAsyncLocalStorage().getStore().get('request'); //.body.lpaCode;
	let flagName = featureFlagName.toString().trim();

	if (!flagName) {
		console.error('A feature flag key must be supplied.');
	} else {
		try {
			const result = await appConfigClient.getConfigurationSetting({
				key: `.appconfig.featureflag/${flagName}`
			});

			if (result && typeof result === 'object') {
				const parsedResult = JSON.parse(result.value);
				const userGroup = parsedResult.conditions.client_filters[0].parameters.Audience.Users;
				const isUserInUserGroup = userGroup.includes(user);
				console.debug('Feature flag: ' + parsedResult.id, parsedResult.enabled);
				console.debug('User in feature flag user group: ' + isUserInUserGroup);
				return parsedResult.enabled && isUserInUserGroup;
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	}
	return false;
};

module.exports = { isFeatureActive };

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
