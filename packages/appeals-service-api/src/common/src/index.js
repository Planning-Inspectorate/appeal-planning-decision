const healthcheck = require('./health');
const prometheus = require('./prometheus');

module.exports = {
	healthcheck,
	prometheus
};
