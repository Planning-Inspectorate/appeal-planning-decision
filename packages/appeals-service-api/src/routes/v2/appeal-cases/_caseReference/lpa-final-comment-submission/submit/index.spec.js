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
const mockNotifyClient = {
	sendEmail: jest.fn()
};

jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
	return {
		getNotifyClient: () => mockNotifyClient
	};
});
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
const config = require('../../../../../../configuration/config');
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
const formattedFinalComment1 = {
	caseReference: '003',
	representation: 'This is a test comment',
	representationSubmittedDate: expect.any(String),
	representationType: 'final_comment',
	lpaCode: 'Q9999',
	documents: []
};
const formattedFinalComment2 = {
	caseReference: '004',
	representation: 'Another final comment text for lpa case 004',
	representationSubmittedDate: expect.any(String),
	representationType: 'final_comment',
	lpaCode: 'Q9999',
	documents: [
		{
			dateCreated: expect.any(String),
			documentId: '004',
			documentType: 'lpaFinalComment',
			documentURI: 'https://example.com',
			filename: 'doc.pdf',
			mime: 'doc',
			originalFilename: 'mydoc.pdf',
			size: 10293
		}
	]
};
describe('/api/v2/appeal-cases/:caseReference/lpa-final-comment-submission/submit', () => {
	const expectEmail = (email, appealReferenceNumber) => {
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
			config.services.notify.templates.generic,
			email,
			{
				personalisation: {
					subject: `We’ve received your final comments: ${appealReferenceNumber}`,
					content: expect.stringContaining('We’ve received your final comments.')
				},
				reference: expect.any(String),
				emailReplyToId: undefined
			}
		);
		mockNotifyClient.sendEmail.mockClear();
	};
	it('Formats S78 lpa final comment submission without docs for case 003', async () => {
		utils.getDocuments.mockReturnValue([]);
		await createAppeal('003');
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const lpaFinalCommentData = {
			lpaFinalComment: true,
			lpaFinalCommentDetails: 'This is a test comment',
			lpaFinalCommentDocuments: false
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/003/lpa-final-comment-submission`)
			.send(lpaFinalCommentData);
		await appealsApi
			.post(`/api/v2/appeal-cases/003/lpa-final-comment-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedFinalComment1],
			'Create'
		);
		expectEmail('test@example.com', '003');
	});
	it('Formats S78 lpa final comment submission with docs for case 004', async () => {
		utils.getDocuments.mockReturnValue([
			{
				documentId: '004',
				filename: 'doc.pdf',
				originalFilename: 'mydoc.pdf',
				documentType: 'lpaFinalComment',
				documentURI: 'https://example.com',
				size: 10293,
				dateCreated: new Date().toISOString(),
				mime: 'doc'
			}
		]);
		await createAppeal('004');
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const lpaFinalCommentData = {
			lpaFinalComment: true,
			lpaFinalCommentDetails: 'Another final comment text for lpa case 004',
			lpaFinalCommentDocuments: true,
			uploadLPAFinalCommentDocuments: true
		};
		await appealsApi
			.post('/api/v2/appeal-cases/004/lpa-final-comment-submission')
			.send(lpaFinalCommentData);
		await appealsApi
			.post(`/api/v2/appeal-cases/004/lpa-final-comment-submission/submit`)
			.expect(200);
		expect(sendEvents).toHaveBeenCalledWith(
			'appeal-fo-representation-submission',
			[formattedFinalComment2],
			'Create'
		);
		expectEmail('test@example.com', '004');
	});
	it('404s if the final comment submission cannot be found', async () => {
		await appealsApi
			.post('/api/v2/appeal-cases/nothere/lpa-final-comment-submissions/submit')
			.expect(404);
	});
});
