const supertest = require('supertest');
const app = require('../../../../../../app');
const { createPrismaClient } = require('../../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { sendEvents } = require('../../../../../../../src/infrastructure/event-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE, SERVICE_USER_TYPE } = require('pins-data-model');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');
const { isFeatureActive } = require('../../../../../../configuration/featureFlag');
/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
let validUser;
const validLpa = 'Q9999';
jest.mock('../../../../../../configuration/featureFlag');
jest.mock('../../../../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = '';
	return {
		auth: jest.fn(() => {
			return (req, _res, next) => {
				req.auth = {
					payload: {
						sub: currentSub
					}
				};
				next();
			};
		}),
		setCurrentSub: (newSub) => {
			currentSub = newSub;
		}
	};
});
jest.mock('@pins/common/src/middleware/validate-token', () => {
	let currentLpa = validLpa;
	return {
		validateToken: jest.fn(() => {
			return (req, _res, next) => {
				req.id_token = {
					lpaCode: currentLpa
				};
				next();
			};
		}),
		setCurrentLpa: (newLpa) => {
			currentLpa = newLpa;
		}
	};
});
jest.mock('../../../../../../../src/infrastructure/event-client', () => ({
	sendEvents: jest.fn()
}));
const testR6ServiceUser1 = 'testR6ServiceUserID1';

jest.setTimeout(30000);
beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();
	/////////////////////
	///// SETUP APP ////
	///////////////////
	appealsApi = supertest(app);
	await seedStaticData(sqlClient);
	const email = crypto.randomUUID() + '@example.com';
	const user = await sqlClient.appealUser.create({
		data: {
			email
		}
	});
	await sqlClient.serviceUser.createMany({
		data: [
			{
				internalId: crypto.randomUUID(),
				emailAddress: email,
				id: testR6ServiceUser1,
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '307'
			},
			{
				internalId: crypto.randomUUID(),
				emailAddress: email,
				id: testR6ServiceUser1,
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: '308'
			}
		]
	});
	validUser = user.id;
});
jest.mock('../../../../../../services/back-office-v2/formatters/utils', () => ({
	getDocuments: jest.fn(() => [])
}));
const utils = require('../../../../../../services/back-office-v2/formatters/utils');
beforeEach(async () => {
	isFeatureActive.mockImplementation(() => {
		return true;
	});
	utils.getDocuments.mockReset();
});
afterEach(async () => {
	jest.clearAllMocks();
});
afterAll(async () => {
	await sqlClient.$disconnect();
});
/**
 * @returns {Promise<string|undefined>}
 */
const createAppeal = async (caseRef) => {
	const appeal = await sqlClient.appeal.create({
		include: {
			AppealCase: true
		},
		data: {
			Users: {
				create: {
					userId: validUser,
					role: APPEAL_USER_ROLES.RULE_6_PARTY
				}
			},
			AppealCase: {
				create: {
					...createTestAppealCase(caseRef, 'S78', validLpa),
					proofsOfEvidenceDueDate: new Date().toISOString()
				}
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};
const formattedProofs1 = {
	caseReference: '307',
	representation: null,
	representationSubmittedDate: expect.any(String),
	representationType: 'proofs_evidence',
	serviceUserId: testR6ServiceUser1,
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: '307',
			documentType: APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE,
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};
const formattedProofs2 = {
	caseReference: '308',
	representation: null,
	representationSubmittedDate: expect.any(String),
	representationType: 'proofs_evidence',
	serviceUserId: testR6ServiceUser1,
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: '308',
			documentType: APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE,
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		},
		{
			dateCreated: expect.any(String),
			documentId: '309',
			documentType: APPEAL_DOCUMENT_TYPE.RULE_6_WITNESSES_EVIDENCE,
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};
describe('/api/v2/appeal-cases/:caseReference/rule-6-proof-evidence-submission/submit', () => {
	it('Formats S78 rule 6 proof of evidence submission with one doc type for case 307', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: '307',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE,
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);
		await createAppeal('307');
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const rule6ProofOfEvidenceData = {
			uploadRule6ProofOfEvidenceDocuments: true,
			rule6Witnesses: false
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/307/rule-6-proof-evidence-submission`)
			.send(rule6ProofOfEvidenceData);
		await appealsApi
			.post(`/api/v2/appeal-cases/307/rule-6-proof-evidence-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedProofs1],
			'Create'
		);
	});
	it('Formats S78 rule 6 proof of evidence submission with both doc types for case 308', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: '308',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE,
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			},
			{
				documentId: '309',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: APPEAL_DOCUMENT_TYPE.RULE_6_WITNESSES_EVIDENCE,
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);
		await createAppeal('308');
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const rule6ProofOfEvidenceData = {
			uploadRule6ProofOfEvidenceDocuments: true,
			rule6Witnesses: true,
			uploadRule6WitnessesEvidence: true
		};
		await appealsApi
			.post('/api/v2/appeal-cases/308/rule-6-proof-evidence-submission')
			.send(rule6ProofOfEvidenceData);
		await appealsApi
			.post(`/api/v2/appeal-cases/308/rule-6-proof-evidence-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedProofs2],
			'Create'
		);
	});
	it('404s if the proof of evidence submission cannot be found', async () => {
		await appealsApi
			.post('/api/v2/appeal-cases/nothere/rule-6-proof-evidence-submissions/submit')
			.expect(404);
	});
});
