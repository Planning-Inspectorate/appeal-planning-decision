const { defineConfig } = require('cypress');
const { verifyDownloadTasks } = require('cy-verify-downloads');
const { azureSignIn } = require('./cypress/support/login');
const {
  clearAllCookies,
  cookiesFileExists
} = require('./cypress/support/cypressUtils');
require('dotenv').config();

module.exports = defineConfig({
  pageLoadTimeout: 300000,
  downloadsFolder: 'cypress/downloads',
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
  video: false,
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    overwrite: false,
    html: true,
    json: false,
    reportFilename: "[name]",
    timestamp: "mmddyyyy_HHMMss",
    reportPageTitle: 'Cypress Inline Reporter',
    embeddedScreenshots: true,
    inlineAssets: true,
  },


  e2e: {
    async setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', verifyDownloadTasks);
      on('task', { AzureSignIn: azureSignIn });
      on('task', { ClearAllCookies: clearAllCookies });
      on('task', { CookiesFileExists: cookiesFileExists });
      return config;
    },
    env: {
      PASSWORD: process.env.USER_PASSWORD,
      APPELLANT_EMAIL: process.env.APPELLANT_EMAIL
    },
    baseUrl: 'https://appeals-service-test.planninginspectorate.gov.uk',
    appeals_beta_base_url: 'https://appeals-service-test.planninginspectorate.gov.uk',
    supportFile: 'cypress/support/e2e.js',
    testIsolation: false,
    experimetalSessionAndOrigin: true,
    experimentalOriginDependencies: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalRunAllSpecs: true,
    retries: 0
  }
});
