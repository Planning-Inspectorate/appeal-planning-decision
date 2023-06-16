/**
 * server
 */

const http = require('http');
require('express-async-errors');

const healthChecks = require('./lib/healthchecks');
const app = require('./app');

module.exports = () => {
	const server = http.createServer(app);
	healthChecks(server);

	server.listen(8080, () => {
	});
};
