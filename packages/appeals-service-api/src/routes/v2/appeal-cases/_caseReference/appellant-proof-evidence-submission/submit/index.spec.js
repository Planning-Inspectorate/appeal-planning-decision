const supertest = require('supertest');
const app = require('../../../../../../app');
const { createPrismaClient } = require('../../../../../../db/db-client');
const { sendEvents } = require('../../../../../../../src/infrastructure/event-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE, SERVICE_USER_TYPE } = require('pins-data-model');
const crypto = require('crypto');
const config = require('../../../../../../configuration/config');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');
const { isFeatureActive } = require('../../../../../../configuration/featureFlag');
/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
/**
 * @type {string}
 */
let validUser;
const validLpa = 'Q9999';
/**
 * @type {string}
 */
let validEmail;

jest.mock('../../../../../../configuration/featureFlag');
jest.mock('../../../../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = '';
	return {
		auth: jest.fn(() => {
			return (
				/** @type {{ auth: { payload: { sub: string; }; }; }} */ req,
				/** @type {any} */ _res,
				/** @type {() => void} */ next
			) => {
				req.auth = {
					payload: {
						sub: currentSub
					}
				};
				next();
			};
		}),
		setCurrentSub: (/** @type {string} */ newSub) => {
			currentSub = newSub;
		}
	};
});
jest.mock('@pins/common/src/middleware/validate-token', () => {
	let currentLpa = validLpa;
	return {
		validateToken: jest.fn(() => {
			return (
				/** @type {{ id_token: { lpaCode: string; }; }} */ req,
				/** @type {any} */ _res,
				/** @type {() => void} */ next
			) => {
				req.id_token = {
					lpaCode: currentLpa
				};
				next();
			};
		}),
		setCurrentLpa: (/** @type {string} */ newLpa) => {
			currentLpa = newLpa;
		}
	};
});
jest.mock('../../../../../../../src/infrastructure/event-client', () => ({
	sendEvents: jest.fn()
}));
const mockNotifyClient = {
	sendEmail: jest.fn()
};
jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
	return {
		getNotifyClient: () => mockNotifyClient
	};
});
const testServiceUserId = 'testAppUserId1';
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
				id: testServiceUserId,
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: '207'
			},
			{
				internalId: crypto.randomUUID(),
				emailAddress: email,
				id: testServiceUserId,
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: '208'
			}
		]
	});
	validUser = user.id;
	validEmail = user.email;
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
beforeEach(() => {
	jest.clearAllMocks();
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
const createAppeal = async (/** @type {string} */ caseRef) => {
	const appeal = await sqlClient.appeal.create({
		include: {
			AppealCase: true
		},
		data: {
			Users: {
				create: {
					userId: validUser,
					role: APPEAL_USER_ROLES.APPELLANT
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
	caseReference: '207',
	representation: null,
	representationSubmittedDate: expect.any(String),
	representationType: 'proofs_evidence',
	serviceUserId: testServiceUserId,
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: '207',
			documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};
const formattedProofs2 = {
	caseReference: '208',
	representation: null,
	representationSubmittedDate: expect.any(String),
	representationType: 'proofs_evidence',
	serviceUserId: testServiceUserId,
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: '208',
			documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		},
		{
			dateCreated: expect.any(String),
			documentId: '209',
			documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_WITNESSES_EVIDENCE,
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};

describe('/api/v2/appeal-cases/:caseReference/appellant-proof-evidence-submission/submit', () => {
	const expectEmails = (/** @type {string} */ caseRef) => {
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
			config.services.notify.templates.generic,
			validEmail,
			{
				personalisation: {
					subject: `We have received your proof of evidence and witnesses: ${caseRef}`,
					content: expect.stringContaining(
						'We will contact you when the local planning authority and any other parties submit their proof of evidence and witnesses.'
					)
				},
				reference: expect.any(String),
				emailReplyToId: undefined
			}
		);
		mockNotifyClient.sendEmail.mockClear();
	};
	it('Formats S78 appellant proof of evidence submission with one doc type for case 207', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: '207',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);
		const caseRef = '207';
		await createAppeal(caseRef);
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const appellantProofOfEvidenceData = {
			uploadAppellantProofOfEvidenceDocuments: true,
			appellantWitnesses: false
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/207/appellant-proof-evidence-submission`)
			.send(appellantProofOfEvidenceData);
		await appealsApi
			.post(`/api/v2/appeal-cases/207/appellant-proof-evidence-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedProofs1],
			'Create'
		);
		sendEvents.mockClear();
		expectEmails(caseRef);
	});
	it('Formats S78 appellant proof of evidence submission with both doc types for case 208', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: '208',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			},
			{
				documentId: '209',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_WITNESSES_EVIDENCE,
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);
		const caseRef = '208';
		await createAppeal(caseRef);
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const appellantProofOfEvidenceData = {
			uploadAppellantProofOfEvidenceDocuments: true,
			appellantWitnesses: true,
			uploadAppellantWitnessesEvidence: true
		};
		await appealsApi
			.post('/api/v2/appeal-cases/208/appellant-proof-evidence-submission')
			.send(appellantProofOfEvidenceData);
		await appealsApi
			.post(`/api/v2/appeal-cases/208/appellant-proof-evidence-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedProofs2],
			'Create'
		);
		sendEvents.mockClear();
		expectEmails(caseRef);
	});
	it('404s if the proof of evidence submission cannot be found', async () => {
		await appealsApi
			.post('/api/v2/appeal-cases/nothere/appellant-proof-evidence-submissions/submit')
			.expect(404);
	});
});
