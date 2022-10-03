// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @summary Feature flags are settings that follow specific JSON schema for the value.
 */
 const {
    AppConfigurationClient,
    ConfigurationSetting,
    featureFlagContentType,
    FeatureFlagValue,
    parseFeatureFlag
  } = require("@azure/app-configuration");

  const AsyncLocalStorage = require('node:async_hooks')
  const asyncLocalStorage = new AsyncLocalStorage();
  
  // Load the .env file if it exists
  // import * as dotenv from "dotenv";
  // dotenv.config();

  // Set the following environment variable or edit the value on the following line.
    const connectionString = "Endpoint=https://pins-asc-appeals-service-dev-ukw-001.azconfig.io;Id=xbZ0-ln-s0:DSk9gGngBpWQ2wivO6nB;Secret=tMBrLU5G3geDGvVUeteY3tQXZDY7SBbCAnSwYzLg1cg=";
    const appConfigClient = new AppConfigurationClient(connectionString);

    const isFeatureActive = async (featureFlagName) => {

        const store = asyncLocalStorage.getStore();
        console.log(store);
        store.get("request")
        // console.log('request')
        // console.log(request)
        // console.log('/request')
        
        // const useFeatureFlag = (featureFlagName = '') => {
            let flagName = featureFlagName.toString().trim()

        if (!flagName) {
            console.error('A feature flag key must be supplied.');
        } else {
            try {
                const result = await appConfigClient.getConfigurationSetting({
                    key: `.appconfig.featureflag/${flagName}`,
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

//   /**
//    * typeguard - for targeting client filter
//    */
//   function isTargetingClientFilter(
//     clientFilter: any
//   ): clientFilter is {
//     parameters: {
//       Audience: {
//         Groups: Array<{ Name: string; RolloutPercentage: number }>;
//         Users: Array<string>;
//         DefaultRolloutPercentage: number;
//       };
//     };
//   } {
//     return (
//       clientFilter.name === "Microsoft.Targeting" &&
//       clientFilter.parameters &&
//       clientFilter.parameters["Audience"] &&
//       Array.isArray(clientFilter.parameters["Audience"]["Groups"]) &&
//       Array.isArray(clientFilter.parameters["Audience"]["Users"]) &&
//       typeof clientFilter.parameters["Audience"]["DefaultRolloutPercentage"] === "number"
//     );
//   }

