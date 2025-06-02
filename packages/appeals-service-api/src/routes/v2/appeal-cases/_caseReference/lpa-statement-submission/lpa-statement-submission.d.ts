import type { Prisma } from '@prisma/client';

export type LPAStatementSubmission = Prisma.LPAStatementSubmissionGetPayload<{
	include: {
		AppealCase: {
			select: {
				LPACode: true;
				appealTypeCode: true;
				caseReference: true;
				finalCommentsDueDate: true;
				siteAddressLine1: true;
				siteAddressLine2: true;
				siteAddressTown: true;
				siteAddressCounty: true;
				siteAddressPostcode: true;
				applicationReference: true;
			};
		};
		SubmissionDocumentUpload: true;
	};
}>;
