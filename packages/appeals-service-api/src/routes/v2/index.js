const { readdirSync, lstatSync } = require('fs');
const path = require('path');

/**
 * Recursively list folders from the given directory that include an index.js file
 *
 * @param {string} directory
 * @param {boolean} [includeRoot]
 * @returns {string[]}
 */
function getRoutes(directory = __dirname, includeRoot = false) {
	/** @type {string[]} */
	const paths = [];
	for (const entry of readdirSync(directory)) {
		const entryPath = path.join(directory, entry);
		const isDir = lstatSync(entryPath).isDirectory();

		if (isDir) {
			paths.push(...getRoutes(entryPath, true));
		} else if (entry === 'index.js' && includeRoot) {
			paths.push(directory);
		}
	}
	return paths;
}

const routePaths = getRoutes();

/**
 * Routes loaded from each directory
 *
 * @type {Object<string, import('express').IRouter>}
 */
const routes = {};

for (const dirName of routePaths) {
	const { router } = require(`${dirName}`);
	const relativePath = dirName
		.replace(__dirname, '') // just need relative path
		.replace(/^_/, ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
		.replace('/index.js', '');
	routes[relativePath] = router;
}

module.exports = { routes };
