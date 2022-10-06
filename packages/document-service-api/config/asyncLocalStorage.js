/**
 * This is a singleton designed to allow us to share data across modules. This a singleton because
 * calling `new AsyncLocalStorage()` loses the previous store, so to persist the store, we can only
 * have one AsyncLocalStorage object.
 *
 * Current use cases are:
 *
 * 1. Sharing the request object for each API request made (see src/app.js)
 *  1.1 This object is used for determining if a feature flag is active (see config/featureFlag.js)
 */

const { AsyncLocalStorage } = require('node:async_hooks');
let asyncLocalStorage;
const getAsyncLocalStorage = () => {
	if (asyncLocalStorage === undefined) {
		asyncLocalStorage = new AsyncLocalStorage();
	}
	return asyncLocalStorage;
};

module.exports = getAsyncLocalStorage;
