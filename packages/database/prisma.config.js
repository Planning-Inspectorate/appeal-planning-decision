// prettier-ignore
try { require('node:process').loadEnvFile(); } catch {/* ignore errors*/}

const { defineConfig } = require('prisma/config');
const path = require('path');

module.exports = defineConfig({
	schema: path.join('src', 'schema.prisma'),
	migrations: {
		path: path.join('src', 'migrations'),
		seed: 'node src/seed/seed-dev.js'
	},
	datasource: {
		url: process.env.SQL_CONNECTION_STRING || process.env.SQL_CONNECTION_STRING_ADMIN
	}
});
