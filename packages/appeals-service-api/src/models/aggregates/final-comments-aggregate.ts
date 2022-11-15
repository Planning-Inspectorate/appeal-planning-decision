import { DocumentEntity } from '../entities/document-entity';
import { SecureCodeEntity } from '../entities/secure-code-entity';
import { Model } from '../model';

export class FinalCommentsAggregate extends Model {
	private caseReference: string;
	private secureCode: SecureCodeEntity;
	private appellant_email: string;
	private documents: Array<DocumentEntity>;
	private submittedToBackOffice: number;

	constructor(caseReference: string, appellant_email: string) {
		super();
		this.caseReference = caseReference;
		this.secureCode = new SecureCodeEntity();
		this.appellant_email = appellant_email;
	}
}