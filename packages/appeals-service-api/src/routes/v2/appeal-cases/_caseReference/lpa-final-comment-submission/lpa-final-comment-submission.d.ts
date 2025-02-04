import type { Prisma } from '@prisma/client';

export type LPAFinalCommentSubmission = Prisma.LPAFinalCommentSubmissionGetPayload<{
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
