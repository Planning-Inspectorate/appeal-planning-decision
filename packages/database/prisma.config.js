const { defineConfig } = require('prisma/config');
const path = require('path');
const dotenv = require('dotenv');

// load configuration from .env file into process.env
dotenv.config();

module.exports = defineConfig({
	schema: path.join('src', 'schema.prisma'),
	migrations: {
		path: path.join('src', 'migrations'),
		seed: 'node src/seed/seed-dev.js'
	}
});
