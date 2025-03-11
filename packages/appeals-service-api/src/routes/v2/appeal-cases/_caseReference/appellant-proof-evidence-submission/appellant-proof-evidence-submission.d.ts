import type { Prisma } from '@prisma/client';

export type AppellantProofOfEvidenceSubmission =
	Prisma.AppellantProofOfEvidenceSubmissionGetPayload<{
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
