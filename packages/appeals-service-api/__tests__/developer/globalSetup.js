module.exports = async () => {
	const { create } = require('./external-dependencies/database/test-database');
	process.env.LOGGER_LEVEL = 'fatal';
	await create();
};
