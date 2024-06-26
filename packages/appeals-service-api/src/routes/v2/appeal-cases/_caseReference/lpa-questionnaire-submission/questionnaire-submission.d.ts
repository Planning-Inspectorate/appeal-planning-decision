import type { Prisma } from '@prisma/client';

export type LPAQuestionnaireSubmission = Prisma.LPAQuestionnaireSubmissionGetPayload<{
	include: {
		AppealCase: {
			select: {
				LPACode: true;
				appealTypeCode: true;
			};
		};
		SubmissionDocumentUpload: true;
		SubmissionAddress: true;
		SubmissionLinkedCase: true;
		SubmissionListedBuilding: true;
	};
}>;
