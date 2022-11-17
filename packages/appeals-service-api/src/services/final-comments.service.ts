import { HorizonGateway } from '../gateway/horizon-gateway';
import { FinalCommentsAggregate } from '../models/aggregates/final-comments-aggregate';
import { FinalCommentsRepository } from '../repositories/final-comments-repository';
import { sendSaveAndReturnEnterCodeIntoServiceEmail } from '../lib/notify';

export class FinalCommentsService {
	private finalCommentsRepository: FinalCommentsRepository;
	private horizonGateway: HorizonGateway;

	constructor() {
		this.finalCommentsRepository = new FinalCommentsRepository();
		this.horizonGateway = new HorizonGateway();
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
		if (finalCommentsFound == null) {
			return false;
		}

		const finalCommentsDueDate = await this.horizonGateway.getFinalCommentsDueDate(caseReference);
		if (
			finalCommentsDueDate == undefined ||
			new Date().valueOf() >= finalCommentsDueDate.valueOf()
		) {
			return false;
		}

		sendSaveAndReturnEnterCodeIntoServiceEmail(
			finalCommentsFound.caseReference,
			finalCommentsFound.appellantEmail,
			finalCommentsFound.secureCode.pin
		);
		return true;
	}
}
