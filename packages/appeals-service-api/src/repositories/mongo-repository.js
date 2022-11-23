const { Model } = require('../models/model');
const mongodb = require('../db/db');

/**
 * This is intended to be used as an [abstract class]{@link https://en.wikipedia.org/wiki/Abstract_type}.
 */
class MongoRepository {

	/**
	 * 
	 * @param {string} collectionName The name of the Mongo collection that this repository is intended to handle.
	 */
	constructor(collectionName) {
		this.collectionName = collectionName;
	}

	/**
	 * 
	 * @param {any} query This should be JSON that will enable a query on the collection that this
	 * repository is intended to handle. See {@link https://www.mongodb.com/docs/manual/tutorial/query-documents/}
	 * for more details. 
	 * @returns {Promise<Model>} The document found as a result of executing the `query` specified on the
	 * collection specified via the constructor.
	 */
	async findOneByQuery(query) {
		return await mongodb.get().collection(this.collectionName).findOne(query);
	}

	/**
	 * 
	 * @param {Model} model The model to insert into the collection specified by the constructor
	 * @returns {Promise<Model>} The model representation of the document inserted into the 
	 * collection specified by the constructor.
	 */
	async create(model) {
		return await mongodb.get().collection(this.collectionName).insertOne(model);
	}
}

module.exports = { MongoRepository }