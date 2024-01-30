/**
 * workaround - use singleton from clam-av-client
 * but not hit constructor error in tests that haven't mocked dependencies
 * @returns {(import('@pins/common/src/client/clamav-client'))}
 */
const getClamAVClient = () => {
	const clamAVClient = require('./clam-av-client');
	return clamAVClient;
};

module.exports = getClamAVClient;
