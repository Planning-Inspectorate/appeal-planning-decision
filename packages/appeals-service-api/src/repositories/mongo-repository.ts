import { Model } from '../models/model';

const mongodb = require('../db/db');

export abstract class MongoRepository {
	private collectionName: string;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	async get(id: string) {
		return mongodb.get().collection(this.collectionName).findOne({ _id: id });
	}

	async save(model: Model) {
		return mongodb.get().collection(this.collectionName).insertOne(model);
	}

	async replace(data: Model) {
		return mongodb
			.get()
			.collection(this.collectionName)
			.findOneAndUpdate(
				{ _id: data.id },
				{ $set: { uuid: data.id, data } },
				{ returnOriginal: false, upsert: false }
			);
	}
}
