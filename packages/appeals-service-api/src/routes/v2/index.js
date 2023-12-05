const { readdirSync, lstatSync } = require('fs');
const path = require('path');

/**
 * folders in this directory
 * @type {string[]}
 */
const dirNames = readdirSync(__dirname).filter((name) =>
	lstatSync(path.join(__dirname, name)).isDirectory()
);

/**
 * Routes loaded from each directory
 *
 * @type {Object<string, import('express').IRouter>}
 */
const routes = {};

for (const dirName of dirNames) {
	const { router } = require(`./${dirName}`);
	routes[dirName] = router;
}

module.exports = { routes };
