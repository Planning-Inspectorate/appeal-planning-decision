const { defineConfig } = require('cypress');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const webpack = require('@cypress/webpack-preprocessor');

module.exports = defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {
			await preprocessor.addCucumberPreprocessorPlugin(on, config);

			on(
				'file:preprocessor',
				webpack({
					webpackOptions: {
						resolve: {
							extensions: ['.ts', '.js']
						},
						module: {
							rules: [
								{
									test: /\.feature$/,
									use: [
										{
											loader: '@badeball/cypress-cucumber-preprocessor/webpack',
											options: config
										}
									]
								}
							]
						}
					}
				})
			);
			return config;
		},
		appeals_beta_base_url: 'https://appeals-service-test.planninginspectorate.gov.uk', //TODO: make this an env var?
		horizon_base_url: 'http://10.0.7.4:8000/horizon',
		supportFile: false,
		testIsolation: false
	}
});
