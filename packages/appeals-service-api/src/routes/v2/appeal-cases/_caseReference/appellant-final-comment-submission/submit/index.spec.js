const supertest = require('supertest');
const app = require('../../../../../../app');
const { createPrismaClient } = require('../../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
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

	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com',
			serviceUserId: 'userID1'
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
				create: createTestAppealCase(caseRef, 'S78', validLpa)
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};

const formattedFinalComment1 = {
	caseReference: '001',
	representation: 'This is a test comment',
	representationSubmittedDate: expect.any(String),
	representationType: 'final_comment',
	serviceUserId: 'userID1',
	documents: []
};

const formattedFinalComment2 = {
	caseReference: '002',
	representation: 'Another final comment text for appellant case 002',
	representationSubmittedDate: expect.any(String),
	representationType: 'final_comment',
	serviceUserId: 'userID1',
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: '002',
			documentType: 'appellantFinalComment',
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};

describe('/api/v2/appeal-cases/:caseReference/appellant-final-comment-submissions/submit', () => {
	it('Formats S78 appellant final comment submission without docs for case 001', async () => {
		utils.getDocuments.mockReturnValue([]);
		await createAppeal('001');

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const appellantFinalCommentData = {
			appellantFinalComment: true,
			appellantFinalCommentDetails: 'This is a test comment',
			appellantFinalCommentDocuments: false
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/001/appellant-final-comment-submission`)
			.send(appellantFinalCommentData);

		await appealsApi
			.post(`/api/v2/appeal-cases/001/appellant-final-comment-submission/submit`)
			.expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedFinalComment1],
			'Create'
		);
	});
	it('Formats S78 appellant final comment submission with docs for case 002', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: '002',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: 'appellantFinalComment',
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);

		await createAppeal('002');
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const appellantFinalCommentData = {
			appellantFinalComment: true,
			appellantFinalCommentDetails: 'Another final comment text for appellant case 002',
			appellantFinalCommentDocuments: true,
			uploadAppellantFinalCommentDocuments: true
		};

		await appealsApi
			.post('/api/v2/appeal-cases/002/appellant-final-comment-submission')
			.send(appellantFinalCommentData);

		await appealsApi
			.post(`/api/v2/appeal-cases/002/appellant-final-comment-submission/submit`)
			.expect(200);

		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedFinalComment2],
			'Create'
		);
	});
	it('404s if the final comment submission cannot be found', async () => {
		await appealsApi
			.post('/api/v2/appeal-cases/nothere/appellant-final-comment-submissions/submit')
			.expect(404);
	});
});
