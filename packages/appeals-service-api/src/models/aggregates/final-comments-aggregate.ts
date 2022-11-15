import { DocumentEntity } from '../entities/document-entity';
import { SecureCodeEntity } from '../entities/secure-code-entity';
import { Model } from '../model';

export class FinalCommentsAggregate extends Model {
	readonly caseReference: string;
	readonly appellantEmail: string;
	readonly secureCode: SecureCodeEntity;
	private documents: Array<DocumentEntity>;
	private submittedToBackOffice: number;

	constructor(caseReference: string, appellantEmail: string) {
		super();
		this.caseReference = caseReference;
		this.appellantEmail = appellantEmail;
		this.secureCode = new SecureCodeEntity();
	}
}