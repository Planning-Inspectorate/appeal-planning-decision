const { defineConfig } = require('cypress');
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
	e2e: {
		async setupNodeEvents(on, config){
			await preprocessor.addCucumberPreprocessorPlugin (on, config);

			on(
				"file:preprocessor",
				createBundler({
					plugins: [createEsbuildPlugin.default(config)],
				})
			);

			
		},
		specPattern: 'platform-feature-tests/e2e/**/*.feature',
		appeals_beta_base_url: 'https://appeals-service-test.planninginspectorate.gov.uk', //TODO: make this an env var?
		horizon_base_url: 'http://10.0.7.4:8000/horizon'
	}
}); 
