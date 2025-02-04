import type { Prisma } from '@prisma/client';

export type Rule6ProofOfEvidenceSubmission = Prisma.Rule6ProofOfEvidenceSubmissionGetPayload<{
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
