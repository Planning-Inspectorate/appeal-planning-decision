const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',

  video: false,

  reporterOptions: {
    reportDir:'cypress/reports',
    charts: true,

    reportPageTitle: 'Cypress Inline Reporter',

    embeddedScreenshots: true, 

    inlineAssets: true, //Adds the asserts inline

  },

	e2e: {
		async setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
		},
		appeals_beta_base_url: 'https://appeals-service-test.planninginspectorate.gov.uk', //TODO: make this an env var?
		horizon_base_url: 'http://10.0.7.4:8000/horizon',
		supportFile: 'cypress/support/e2e.js',
		testIsolation: false
	}
});
