const mongodb = require('../db/db');

/**
 * @typedef {import('mongodb').UpdateResult} UpdateResult
 */

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
	 * @param {any} sort
	 * @param {any} projection
	 * @returns {Promise<any>} The document found as a result of executing the `query` specified on the
	 * collection specified via the constructor.
	 */
	async findOneByQuery(query, sort = {}, projection = {}) {
		if (sort && Object.keys(sort).length > 0) {
			if (Object.keys(projection).length > 0) {
				return await mongodb
					.get()
					.collection(this.collectionName)
					.findOne(query, { sort: sort, projection: projection });
			}
			return await mongodb.get().collection(this.collectionName).findOne(query, { sort: sort });
		}

		if (projection && Object.keys(projection).length > 0) {
			return await mongodb
				.get()
				.collection(this.collectionName)
				.findOne(query, { projection: projection });
		}

		return await mongodb.get().collection(this.collectionName).findOne(query);
	}

	/**
	 *
	 * @param {Model} model The model to insert into the collection specified by the constructor
	 * @returns {Promise<any>} The JSON to insert.
	 */
	async create(model) {
		return await mongodb.get().collection(this.collectionName).insertOne(model);
	}

	async getAllDocumentsThatMatchQuery(query, sort = {}, projection = undefined) {
		let mongoOptions = {};

		if (sort && Object.keys(sort).length > 0) {
			mongoOptions.sort = sort;
		}

		if (projection && Object.keys(projection).length > 0) {
			mongoOptions.projection = projection;
		}

		const result = await mongodb.get().collection(this.collectionName).find(query, mongoOptions);

		return result.toArray();
	}

	/**
	 *
	 * @param {any} filter
	 * @param {any} set
	 * @param {boolean} upsert
	 * @returns {Promise<UpdateResult>}
	 */
	async updateOne(filter, set, upsert = true) {
		return await mongodb
			.get()
			.collection(this.collectionName)
			.updateOne(filter, set, { upsert: upsert });
	}
}

module.exports = { MongoRepository };
