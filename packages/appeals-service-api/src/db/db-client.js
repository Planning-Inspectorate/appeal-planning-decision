const { PrismaClient } = require('@prisma/client');
const config = require('../configuration/config');

const dbClient = new PrismaClient({
	datasourceUrl: config.db.sql.connectionString
});

/**
 * @type {import('@prisma/client').PrismaClient}
 */
module.exports = dbClient;
