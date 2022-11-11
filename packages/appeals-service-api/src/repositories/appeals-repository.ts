import { MongoRepository } from './mongo-repository';

export class AppealsRepository extends MongoRepository {
	constructor() {
		super('appeals');
	}
}
