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
  screenshotsFolder: 'cypress/reports/screenshots',
  reporterOptions: {
    reportDir: 'cypress/reports/reports',
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
      // cross-platform deleteFolder task
      on('task', {
        deleteFolder(folderPath) {
          const fs = require('fs');
          const path = require('path');
          if (!folderPath) {
            folderPath = config.downloadsFolder;
          }
          try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            fs.mkdirSync(folderPath, { recursive: true });
            return true;
          } catch (e) {
            console.error('deleteFolder task failed', e);
            return false;
          }
        }
      });
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
    supportFile: 'cypress/support/e2e.js',
    env: {
      AUTH_PASSWORD: process.env.AUTH_PASSWORD,
      AUTH_EMAIL: process.env.AUTH_EMAIL,
      CASE_ADMIN_EMAIL: process.env.CASE_ADMIN_EMAIL
    },
    appeals_beta_base_url: process.env.CYPRESS_APPEALS_BETA_BASE_URL || 'https://appeals-service-test.planninginspectorate.gov.uk',
    back_office_base_url: process.env.CYPRESS_BACK_OFFICE_BASE_URL || 'https://back-office-appeals-test.planninginspectorate.gov.uk',
    supportFile: 'cypress/support/e2e.js',
    testIsolation: false,
    experimetalSessionAndOrigin: true,
    experimentalOriginDependencies: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalRunAllSpecs: true,
    retries: 0,
    grepOmitFiltered: true,
    grepFilterSpecs: true
  }
});