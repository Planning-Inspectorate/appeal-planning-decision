import type { Prisma } from '@prisma/client';

export type LPAQuestionnaireSubmission = Prisma.LPAQuestionnaireSubmissionGetPayload<{
	include: {
		AppealCase: {
			select: {
				LPACode: true;
			};
		};
		SubmissionDocumentUpload: true;
		SubmissionNeighbourAddress: true;
	};
}>;

type thing = LPAQuestionnaireSubmission[''];
