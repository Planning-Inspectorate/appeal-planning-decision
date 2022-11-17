import { Model } from '../models/model';
const mongodb = require('../db/db');

export abstract class MongoRepository {
	protected collectionName: string;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	protected async findOneByQuery(query: any): Promise<Model> {
		return await mongodb.get().collection(this.collectionName).findOne(query);
	}

	async create(model: Model): Promise<Model> {
		return await mongodb.get().collection(this.collectionName).insertOne(model);
	}
}