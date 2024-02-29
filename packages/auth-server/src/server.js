/**
 * server
 */

import http from 'http';

import config from './configuration/config.js';
import logger from './lib/logger.js';
import app from './app.js';

const server = () => {
	const server = http.createServer(app);

	server.listen(config.server.port, () => {
		logger.info({ config }, 'Listening');
	});
};

export default server;
