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
const testCase1 = '405';
const testCase2 = '406';

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
const testR6ServiceUserID2 = 'testR6ServiceUserId2';
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
				id: testR6ServiceUserID2,
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: testCase1
			},
			{
				internalId: crypto.randomUUID(),
				emailAddress: email,
				id: testR6ServiceUserID2,
				serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
				caseReference: testCase2
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
					finalCommentsDueDate: new Date().toISOString()
				}
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};
const formattedStatement1 = {
	caseReference: testCase1,
	representation: 'This is a test comment',
	representationSubmittedDate: expect.any(String),
	representationType: 'statement',
	serviceUserId: testR6ServiceUserID2,
	documents: []
};
const formattedStatement2 = {
	caseReference: testCase2,
	representation: 'Another statement text for rule 6 case 406',
	representationSubmittedDate: expect.any(String),
	representationType: 'statement',
	serviceUserId: testR6ServiceUserID2,
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: testCase2,
			documentType: APPEAL_DOCUMENT_TYPE.RULE_6_STATEMENT,
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};
describe('/api/v2/appeal-cases/:caseReference/rule-6-statement-submission/submit', () => {
	it('Formats S78 rule 6 statement submission without docs for case 405', async () => {
		utils.getDocuments.mockReturnValue([]);
		await createAppeal(testCase1);
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const rule6StatementData = {
			rule6Statement: 'This is a test comment',
			rule6AdditionalDocuments: false
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/${testCase1}/rule-6-statement-submission`)
			.send(rule6StatementData);
		await appealsApi
			.post(`/api/v2/appeal-cases/${testCase1}/rule-6-statement-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedStatement1],
			'Create'
		);
	});
	it('Formats S78 rule 6 statement submission with docs for case 406', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: testCase2,
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: APPEAL_DOCUMENT_TYPE.RULE_6_STATEMENT,
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);
		await createAppeal(testCase2);
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const rule6StatementData = {
			rule6Statement: 'Another statement text for rule 6 case 406',
			rule6AdditionalDocuments: true,
			uploadRule6StatementDocuments: true
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/${testCase2}/rule-6-statement-submission`)
			.send(rule6StatementData);
		await appealsApi
			.post(`/api/v2/appeal-cases/${testCase2}/rule-6-statement-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedStatement2],
			'Create'
		);
	});
	it('404s if the statement submission cannot be found', async () => {
		await appealsApi
			.post('/api/v2/appeal-cases/nothere/rule-6-statement-submissions/submit')
			.expect(404);
	});
});
