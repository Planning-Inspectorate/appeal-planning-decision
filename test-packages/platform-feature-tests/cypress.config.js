const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {

		},
		appeals_beta_base_url: 'https://appeals-service-test.planninginspectorate.gov.uk', //TODO: make this an env var?
		horizon_base_url: 'http://10.0.7.4:8000/horizon',
		supportFile: 'cypress/support/e2e.js',
		testIsolation: false
	}
});
