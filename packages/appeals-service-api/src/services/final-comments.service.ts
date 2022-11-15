import { FinalCommentsAggregate } from '../models/aggregates/final-comments-aggregate';
import { FinalCommentsRepository } from '../repositories/final-comments-repository';

export class FinalCommentsService {
	private finalCommentsRepository: FinalCommentsRepository;

	constructor() {
		this.finalCommentsRepository = new FinalCommentsRepository();
	}

	async createFinalComments(caseReference: string, appellantEmail: string): Promise<boolean> {
		const finalCommentWithCaseReference = await this.finalCommentsRepository.getByCaseReference(
			caseReference
		);
		if (finalCommentWithCaseReference) {
			return false;
		}

		const finalCommentsToSave = new FinalCommentsAggregate(caseReference, appellantEmail);
		await this.finalCommentsRepository.create(finalCommentsToSave);
		return true;
	}

	async checkFinalCommentExists(caseReference: string): Promise<boolean> {
		const finalCommentsFound = await this.finalCommentsRepository.getByCaseReference(caseReference);
		return finalCommentsFound !== null;
	}
}