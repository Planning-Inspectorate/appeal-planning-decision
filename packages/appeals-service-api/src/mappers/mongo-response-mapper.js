/**
 * @typedef {import('../repositories/mongo-repository').UpdateResult} UpdateResult
 * @typedef {Object} ApiUpdateResult
 * @property {Number} matchedCount
 * @property {Number} modifiedCount
 * @property {Number} upsertedCount
 */

/**
 * maps an update result from mongo into an api response
 * @param {UpdateResult} mongoUpdateResult
 * @returns {ApiUpdateResult}
 */
function mapUpdateResponse({ matchedCount, modifiedCount, upsertedCount }) {
	return { matchedCount, modifiedCount, upsertedCount };
}

module.exports = {
	mapUpdateResponse
};
