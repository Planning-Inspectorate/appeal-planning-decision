const mongodb = require('../db/db');
const ObjectId = require('mongodb').ObjectId;

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
	 * @returns {Promise<any>} The document found as a result of executing the `query` specified on the
	 * collection specified via the constructor.
	 */
	async findOneByQuery(query) {
		return await mongodb.get().collection(this.collectionName).findOne(query);
	}

	/**
	 *
	 * @param {Model} model The model to insert into the collection specified by the constructor
	 * @returns {any} The JSON to insert.
	 */
	async create(model) {
		return await mongodb.get().collection(this.collectionName).insertOne(model);
	}

	async getAllDocumentsFromCollection() {
		return await mongodb.get().collection(this.collectionName).find().toArray();
	}

	/**
	 *
	 * @param {any[]} updateOneOperations Mongo JSON structures that represent update operations. Their
	 * structure should be:
	 * {
	 * 	id: <_id field of the document to update, but as a string, NOT an ObjectId>,
	 *  updateSet: the updates you want to be commited via $set (see https://www.mongodb.com/docs/manual/reference/operator/update/set/)
	 * }
	 * @returns
	 */
	async upsertManyById(updateOneOperations) {
		const updates = updateOneOperations.map((updateOneOperation) => {
			return {
				updateOne: {
					filter: {
						_id: new ObjectId(updateOneOperation.id)
					},
					update: {
						$set: updateOneOperation.updateSet
					},
					upsert: true
				}
			};
		});

		return await mongodb.get().collection(this.collectionName).bulkWrite(updates);
	}

	/**
	 *
	 * @param {string[]} ids
	 * @returns
	 */
	async deleteMany(ids) {
		const idsForFilter = ids.map((id) => {
			return { _id: id };
		});
		return await mongodb.get().collection(this.collectionName).deleteMany({ $or: idsForFilter });
	}

	async remove(id) {
		return await mongodb.get().collection(this.collectionName).remove({ _id: id }, true);
	}
}

module.exports = { MongoRepository };
