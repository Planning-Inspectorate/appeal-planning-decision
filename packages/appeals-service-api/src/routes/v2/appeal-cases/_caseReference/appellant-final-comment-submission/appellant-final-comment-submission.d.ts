import type { Prisma } from '@prisma/client';

export type AppellantFinalCommentSubmission = Prisma.AppellantFinalCommentSubmissionGetPayload<{
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
