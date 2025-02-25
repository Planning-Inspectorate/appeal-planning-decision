const supertest = require('supertest');
const app = require('../../../../../../app');
const { createPrismaClient } = require('../../../../../../db/db-client');
const { sendEvents } = require('../../../../../../../src/infrastructure/event-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
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
jest.mock('../../../../../../services/lpa.service', () => {
	return jest.fn(() => ({
		getLpaByCode: jest.fn().mockResolvedValue({
			getEmail: jest.fn(() => 'test@example.com'),
			getName: jest.fn(() => 'lpaName')
		}),
		getLpaById: jest.fn().mockResolvedValue({
			getEmail: jest.fn(() => 'test@example.com'),
			getName: jest.fn(() => 'lpaName')
		})
	}));
});
jest.mock('../../../../../../models/entities/lpa-entity', () => ({
	createFromJson: jest.fn(() => ({
		getEmail: jest.fn(() => 'test@example.com')
	}))
}));
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
	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
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
					role: APPEAL_USER_ROLES.APPELLANT
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
	caseReference: '005',
	representation: 'This is a test comment',
	representationSubmittedDate: expect.any(String),
	representationType: 'statement',
	lpaCode: 'Q9999',
	documents: []
};
const formattedStatement2 = {
	caseReference: '006',
	representation: 'Another statement text for lpa case 006',
	representationSubmittedDate: expect.any(String),
	representationType: 'statement',
	lpaCode: 'Q9999',
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: '006',
			documentType: 'lpaStatement',
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};
describe('/api/v2/appeal-cases/:caseReference/lpa-statement-submission/submit', () => {
	it('Formats S78 lpa statement submission without docs for case 005', async () => {
		utils.getDocuments.mockReturnValue([]);
		await createAppeal('005');
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const lpaStatementData = {
			lpaStatement: 'This is a test comment',
			additionalDocuments: false
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/005/lpa-statement-submission`)
			.send(lpaStatementData);
		await appealsApi.post(`/api/v2/appeal-cases/005/lpa-statement-submission/submit`).expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedStatement1],
			'Create'
		);
	});
	it('Formats S78 lpa statement submission with docs for case 006', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: '006',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: 'lpaStatement',
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);
		await createAppeal('006');
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const lpaFinalCommentData = {
			lpaStatement: 'Another statement text for lpa case 006',
			additionalDocuments: true,
			uploadLpaStatementDocuments: true
		};
		await appealsApi
			.post('/api/v2/appeal-cases/006/lpa-statement-submission')
			.send(lpaFinalCommentData);
		await appealsApi.post(`/api/v2/appeal-cases/006/lpa-statement-submission/submit`).expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedStatement2],
			'Create'
		);
	});
	it('404s if the statement submission cannot be found', async () => {
		await appealsApi
			.post('/api/v2/appeal-cases/nothere/lpa-statement-submissions/submit')
			.expect(404);
	});
});
