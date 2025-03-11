import type { Prisma } from '@prisma/client';

export type Rule6StatementSubmission = Prisma.Rule6StatementSubmissionGetPayload<{
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
