module.exports = async () => {
	const { teardown } = require('./external-dependencies/database/test-database');

	await teardown();
};