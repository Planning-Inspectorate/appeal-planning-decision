const mongodb = require('../db/db');
const { MongoRepository } = require('./mongo-repository');

class FailedHorizonUploadRepository extends MongoRepository {
	constructor(){
		super('failed');
	}

	/**
	 *
	 * @param {any} id
	 * @returns {Promise<any>}
	 */
	async getById(id) {
		return await this.findOneByQuery({ _id: id });
	}
	/**
	 *
	 * @returns {Promise<any>}
	 */
	async getAll(){
		return await mongodb
		.get()
		.collection(this.collectionName)
		.find({})
		.toArray();
	}

	/**
	 *
	 * @param {any} appeal
	 * @returns {Promise<any>}
	 */
	async create(appeal) {
		// TODO: as with `replace` below, I have absolutely NO idea why there are 3 id's for
		// a single model?! This needs fixing ASAP
		return await mongodb
			.get()
			.collection(this.collectionName)
			.insertOne({ _id: appeal.id, uuid: appeal.id, appeal });
	}

		/**
	 *
	 * @param {any} appeal
	 * @returns {Promise<any>}
	 */
		async update(appeal) {
			return await mongodb
				.get()
				.collection(this.collectionName)
				.findOneAndUpdate(
					{ _id: appeal.id },
					{ $set: { uuid: appeal.uuid, appeal } },
					{ returnDocument: "after" }
				);
		}

}

module.exports = { FailedHorizonUploadRepository }
