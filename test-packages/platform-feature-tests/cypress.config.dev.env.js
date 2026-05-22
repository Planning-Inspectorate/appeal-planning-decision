// @ts-nocheck
const { defineConfig } = require('cypress');
const baseConfig = require('./cypress.config');

require('dotenv').config();

const e2eOverride = {
	appeals_beta_base_url: 'https://appeals-service-dev.planninginspectorate.gov.uk',
    back_office_base_url: 'https://back-office-appeals-dev.planninginspectorate.gov.uk',
	apiBaseUrl: 'https://pins-app-appeals-bo-api-dev.azurewebsites.net/'
};

module.exports = defineConfig({
    e2e: {
        ...baseConfig.e2e,
        ...e2eOverride
    },
    env: {
        ...baseConfig.env
    }
});
