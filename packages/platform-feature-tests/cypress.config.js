const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		appeals_beta_base_url: 'https://appeals-service-test.planninginspectorate.gov.uk', //TODO: make this an env var?
		horizon_base_url: 'https://'
	}
});
