import type { Prisma } from '@prisma/client';

export type AppellantSubmission = Prisma.AppellantSubmissionGetPayload<{
	include: {
		SubmissionDocumentUpload: true;
		SubmissionAddress: true;
		SubmissionLinkedCase: true;
		SubmissionListedBuilding: true;
		SubmissionIndividual: true;
		SubmissionAppealGround: true;
	};
}>;
