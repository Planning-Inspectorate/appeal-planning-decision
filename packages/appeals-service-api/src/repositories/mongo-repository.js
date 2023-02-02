const mongodb = require('../db/db');
const ObjectId = require('mongodb').ObjectId;
const logger = require('../lib/logger');

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
	 * @param {AggregateDifference[]} aggregateDifferences
	 * @returns
	 */
	async updateMany(aggregateDifferences) {
		logger.info(aggregateDifferences, 'Differences to process via update');
		const collection = mongodb.get().collection(this.collectionName);
		// const updateOneOperations = aggregateDifferences.map(aggregateDifference => {
		// 		const result = { updateOne : {
		// 			filter : {
		// 				_id: new ObjectId(aggregateDifference.id)
		// 			},
		// 			update : {
		// 				$set:	{
		// 					"organisations": aggregateDifference.organisations,
		// 					"contacts" : aggregateDifference.contacts,
		// 					"documents" : aggregateDifference.documents
		// 				}
		// 			},
		// 			upsert : true,
		// 		}};
		// 		logger.info(result, "Update created!")
		// 		return result;
		// 	});

		const updateOneOperations = aggregateDifferences.map((aggregateDifference) => {
			return {
				updateOne: {
					filter: {
						_id: new ObjectId(aggregateDifference._id)
					},
					update: {
						$set: {
							organisations: aggregateDifference.organisations,
							contacts: aggregateDifference.contacts,
							appeal: aggregateDifference.appeal,
							documents: aggregateDifference.documents
						}
					},
					upsert: true
				}
			};
		});
		logger.info(updateOneOperations, 'Updating docs');
		return await collection.bulkWrite(updateOneOperations);
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
}

module.exports = { MongoRepository };
