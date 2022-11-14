const mongodb = require('../db/db');
import { MongoRepository } from './mongo-repository';

export class AppealsRepository extends MongoRepository {
	constructor() {
		super('appeals');
	}

	async getById(id) {
		return await this.findOneByQuery({ _id: id });
	}

	// TODO: as with `replace` below, I have absolutely NO idea why there are 3 id's for
	// a single model?! This needs fixing ASAP
	async create(appeal) {
		return await mongodb
			.get()
			.collection(this.collectionName)
			.insertOne({ _id: appeal.id, uuid: appeal.id, appeal });
	}

	async update(appeal) {
		return await mongodb
			.get()
			.collection(this.collectionName)
			.findOneAndUpdate(
				{ _id: appeal.id },
				{ $set: { uuid: appeal.id, appeal } },
				{ returnOriginal: false, upsert: false }
			);
	}
}
