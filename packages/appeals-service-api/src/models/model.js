const mongodb = require('mongodb');

class Model {
	/**
	 *
	 * @param {mongodb.ObjectId} _id Will be assigned by default.
	 */
	constructor(_id = mongodb.ObjectId()) {
		this._id = _id;
	}
}

module.exports = { Model };
