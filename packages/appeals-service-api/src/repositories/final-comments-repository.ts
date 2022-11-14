import { FinalCommentsAggregate } from '../models/aggregates/final-comments-aggregate';
import { MongoRepository } from './mongo-repository';

export class FinalCommentsRepository extends MongoRepository {
	constructor() {
		super('final-comments');
	}

	async getByCaseReference(caseReference: string) {
		return await this.findOneByQuery({ caseReference: caseReference });
	}
}
