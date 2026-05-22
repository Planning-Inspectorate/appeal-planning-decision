// @ts-nocheck
const { defineConfig } = require('cypress');
const baseConfig = require('./cypress.config');

require('dotenv').config();

// use front office and backoffice defaults if not set
if (!baseConfig.e2e.appeals_beta_base_url) {
	baseConfig.e2e.appeals_beta_base_url = 'https://localhost:9003/';
}

if (!baseConfig.e2e.back_office_base_url) {
	baseConfig.e2e.back_office_base_url = 'https://localhost:8080/';
}

if (!baseConfig.e2e.apiBaseUrl) {
	baseConfig.e2e.apiBaseUrl = 'http://localhost:3000/';
}

module.exports = defineConfig({
	e2e: {
		...baseConfig.e2e
	},
	env: {
		...baseConfig.env
	}
});
