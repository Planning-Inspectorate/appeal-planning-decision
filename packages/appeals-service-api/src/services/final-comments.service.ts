import { FinalCommentsAggregate } from '../models/aggregates/final-comments-aggregate';
import { FinalCommentsRepository } from '../repositories/final-comments-repository';

export class FinalCommentsService {
	private finalCommentsRepository: FinalCommentsRepository;

	async createFinalComments(caseReference: string, appellantEmail: string): Promise<boolean> {
		const finalCommentWithCaseReference = await this.finalCommentsRepository.get(caseReference);
		if (finalCommentWithCaseReference) {
			return false;
		}

		const finalCommentsToSave = new FinalCommentsAggregate(caseReference, appellantEmail);
		await this.finalCommentsRepository.save(finalCommentsToSave);
		return true;
	}

	async checkFinalCommentExists(caseReference: string): Promise<boolean> {
		return await this.finalCommentsRepository.get(caseReference);
	}
}
