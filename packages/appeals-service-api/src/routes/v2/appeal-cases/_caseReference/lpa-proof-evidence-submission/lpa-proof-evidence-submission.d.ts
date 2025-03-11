import type { Prisma } from '@prisma/client';

export type LPAProofOfEvidenceSubmission = Prisma.LPAProofOfEvidenceSubmissionGetPayload<{
	include: {
		AppealCase: {
			select: {
				LPACode: true;
				appealTypeCode: true;
			};
		};
		SubmissionDocumentUpload: true;
	};
}>;
