const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		baseUrl: 'https://appeals-service-test.planninginspectorate.gov.uk' //TODO: make this an env var?
	}
});
