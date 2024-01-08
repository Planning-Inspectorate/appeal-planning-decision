const { readdirSync, lstatSync } = require('fs');
const path = require('path');

/**
 * Recursively list folders from the given directory that include an index.js file
 *
 * @param {string} directory
 * @param {boolean} [includeRoot]
 * @returns {string[]}
 */
function getRoutePaths(directory = __dirname, includeRoot = false) {
	/** @type {string[]} */
	const paths = [];
	for (const entry of readdirSync(directory)) {
		const entryPath = path.join(directory, entry);
		const isDir = lstatSync(entryPath).isDirectory();

		if (isDir) {
			paths.push(...getRoutePaths(entryPath, true));
		} else if (entry === 'index.js' && includeRoot) {
			paths.push(directory);
		}
	}
	return paths;
}

/**
 * @param {string} directory
 * @returns {Object<string, import('express').IRouter>}
 */
const getRoutes = (directory = __dirname) => {
	const routePaths = getRoutePaths(directory);
	/**
	 * @type {Object<string, import('express').IRouter>}
	 */
	const routes = {};

	for (const dirName of routePaths) {
		const { router } = require(`${dirName}`);
		const relativePath = dirName
			.replace(directory, '') // just need relative path
			.replace('_', ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
			.replace('/index.js', '');
		routes[relativePath] = router;
	}

	return routes;
};

module.exports = { getRoutes };
