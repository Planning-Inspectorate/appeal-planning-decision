const { defineConfig } = require('cypress');

module.exports = defineConfig({
  pageLoadTimeout: 300000,
  downloadsFolder:'cypress/downloads',
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
  video: false,
  reporterOptions: {
    reportDir:'cypress/reports',
    charts: true,
    overwrite: false,
    html: true,
    json: false,
    reportFilename: "[name]",
    timestamp: "mmddyyyy_HHMMss",
    reportPageTitle: 'Cypress Inline Reporter',
    embeddedScreenshots: true, 
    inlineAssets: true, //Adds the asserts inline
  },
  

	e2e: {
    // setupNodeEvents(on, config){      
    // },
		async setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task',{isFileExist(filename){
        return require('fs').existsSync(filename)
      }})
		},  
		appeals_beta_base_url: process.env.CYPRESS_APPEALS_BETA_BASE_URL || 'https://appeals-service-test.planninginspectorate.gov.uk',
		supportFile: 'cypress/support/e2e.js',
		testIsolation: false
	}
});
