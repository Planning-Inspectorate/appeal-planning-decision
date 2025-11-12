const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		setupNodeEvents() {
			// implement node event listeners here
		},

		defaultCommandTimeout: 120000, // Increase default command timeout
        taskTimeout: 200000, // Increase task timeout to 2 minutes
	}
});


