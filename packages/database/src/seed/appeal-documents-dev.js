/**
 * @type {import('@prisma/client').Prisma.DocumentCreateInput[]}
 */
const appealDocuments = [
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2aa',
		filename: 'test-application-form.txt',
		originalFilename: 'test-application-form.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'originalApplicationForm',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2ab',
		filename: 'test-plans-drawings.txt',
		originalFilename: 'test-plans-drawings.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'plansDrawings',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2ad',
		filename: 'test-ownership-certificate.txt',
		originalFilename: 'test-ownership-certificate.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'ownershipCertificate',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2ae',
		filename: 'test-design-access.txt',
		originalFilename: 'test-design-access.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'designAccessStatement',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2af',
		filename: 'test-lpa-decision.txt',
		originalFilename: 'test-lpa-decision.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'lpaDecisionLetter',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2ba',
		filename: 'test-appellant-statement.txt',
		originalFilename: 'test-appellant-statement.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'appellantStatement',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2bb',
		filename: 'test-new-plans-drawings.txt',
		originalFilename: 'test-new-plans-drawings.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'newPlansDrawings',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2bc',
		filename: 'test-planning-obligation.txt',
		originalFilename: 'test-planning-obligation.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'planningObligation',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2bd',
		filename: 'test-other-new-documents-1.txt',
		originalFilename: 'test-other-new-documents-1.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'otherNewDocuments',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2be',
		filename: 'test-other-new-documents-2.txt',
		originalFilename: 'test-other-new-documents-2.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'otherNewDocuments',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eda2618c-1c29-46e2-a009-fe78eaefe2bf',
		filename: 'test-statement-common-ground.txt',
		originalFilename: 'test-statement-common-ground.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(Date.now()),
		published: true,
		redacted: false,
		documentType: 'statementCommonGround',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '620776b8-f92d-4f84-8b7e-59ed8706d49a',
		filename: 'test-conservation-map.pdf',
		originalFilename: 'test-conservation-map.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'conservationMap',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '78d77864-89ab-4a39-ace8-ef29416533de',
		filename: 'test-conservation-guidance.doc',
		originalFilename: 'test-conservation-guidance.doc',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'conservationMap',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'f7b47732-3794-4932-bb67-51cc512afee5',
		filename: 'test-tree-preservation.txt',
		originalFilename: 'test-tree-preservation.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'treePreservationPlan',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'd8290e68-bfbb-3bc8-b621-5a9590aa29fd',
		filename: 'test-definitive-map.txt',
		originalFilename: 'test-definitive-map.txt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'definitiveMap',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'a92bebc8-92ff-40e9-a898-4031ab086927',
		filename: 'test-York-Rd-notified-neighbours.odt',
		originalFilename: 'test-York-Rd-notified-neighbours.odt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'whoNotified',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '34f6be00-e486-4d03-956d-66a459c38617',
		filename: 'test-Your-Rd-internal-consultees.odt',
		originalFilename: 'test-Your-Rd-internal-consultees.odt',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'whoNotified',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '68824a81-25cf-4a38-b27c-c827d784745a',
		filename: 'test-155-York-Rd-site-notice-2023.pdf',
		originalFilename: 'test-155-York-Rd-site-notice-2023.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'siteNotice',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'eb4c5d50-e50d-11ee-be89-2fbcccb70cdf',
		filename: 'test-155-York-Rd-neighbour-letter-template-2023.pdf',
		originalFilename: 'test-155-York-Rd-neighbour-letter-template-2023.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'lettersNeighbours',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '4346fcc0-ec18-11ee-86b5-3bd620465af1',
		filename: 'test-155-York-Rd-press-advert.pdf',
		originalFilename: 'test-155-York-Rd-press-advert.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'pressAdvert',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '13da68dd-6c0c-591f-a183-3fadbbb30c37',
		filename: 'test-155-York-Rd-representations-2023.pdf',
		originalFilename: 'test-155-York-Rd-representations-2023.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'otherPartyRepresentations',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '13da68dd-6c0c-591f-a183-3fadbbb30c37',
		filename: 'test-155-York-Rd-PO-report-2023.pdf',
		originalFilename: 'test-155-York-Rd-PO-report-2023.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'planningOfficerReport',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '52e7db71-c141-4b5e-8719-e64109e517c0',
		filename: 'test-CB23-policies-2023.pdf',
		originalFilename: 'test-CB23-policies-2023.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'developmentPlanPolicies',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '34951210-e516-11ee-be89-2fbcccb70cdf',
		filename: 'test-emerging-plan.pdf',
		originalFilename: 'test-emerging-plan.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'emergingPlan',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: '6bcf7d40-e518-11ee-be89-2fbcccb70cdf',
		filename: 'test-other-policies.pdf',
		originalFilename: 'test-other-policies.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'otherRelevantPolicies',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'f57845e0-e518-11ee-be89-2fbcccb70cdf',
		filename: 'test-supplementary-planning-docs.pdf',
		originalFilename: 'test-supplementary-planning-docs.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'supplementaryPlanningDocs',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	},
	{
		id: 'd8290e68-bfbb-3bc8-b621-5a9590aa29fc',
		filename: 'test-infrastructure-levy.pdf',
		originalFilename: 'test-infrastructure-levy.pdf',
		size: 16,
		mime: 'text/plain',
		documentURI: '',
		dateCreated: new Date(),
		published: true,
		redacted: false,
		documentType: 'infrastructureLevy',
		sourceSystem: 'appeals',
		origin: 'pins',
		stage: 'decision',
		AppealCase: {}
	}
];

module.exports = {
	appealDocuments
};
