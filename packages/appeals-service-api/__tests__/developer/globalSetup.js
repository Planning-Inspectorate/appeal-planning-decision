module.exports = async () => {
	const { create } = require('./external-dependencies/database/test-database');

	await create();
};
