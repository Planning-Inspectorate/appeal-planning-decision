// integration setup is expensive so we share mocks and setup between tests
// if this adds too much complexity, just keep the test separate and rename as .test.js

jest.setTimeout(100_000);

/** @typedef {{sendEmail: jest.Mock}} NotifyClientMock */
const mockNotifyClient = { sendEmail: jest.fn() };

/** @typedef {{sendEvents: jest.Mock}} EventClientMock */
const mockEventClient = { sendEvents: jest.fn() };

/** @typedef {{blobMetaGetter: jest.Mock}} BlobMetaGetterMock */
const mockBlobMetaGetter = { blobMetaGetter: jest.fn() };

jest.mock('../../configuration/featureFlag');
jest.mock('../../services/object-store', () => {
	return mockBlobMetaGetter;
});
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
	let currentLpa = '';
	let currentEmail = '';

	return {
		validateToken: jest.fn(() => {
			return (req, _res, next) => {
				req.id_token = {
					lpaCode: currentLpa,
					email: currentEmail
				};
				next();
			};
		}),
		setCurrentLpa: (newLpa, email) => {
			currentLpa = newLpa;
			currentEmail = email;
		}
	};
});
jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
	return {
		getNotifyClient: () => mockNotifyClient
	};
});
jest.mock('../../infrastructure/event-client', () => mockEventClient);
// potentially add this as SQL data when we have moved away from Mongo
jest.mock('../../services/lpa.service', () => {
	class LpaService {
		getLpaByCode() {
			return {
				getLpaCode: () => 'LPA_001',
				getEmail: () => 'lpa@example.com',
				getName: () => 'System Test'
			};
		}
		getLpaById() {
			return {
				getLpaCode: () => 'LPA_001',
				getEmail: () => 'lpa@example.com',
				getName: () => 'System Test'
			};
		}
	}
	return LpaService;
});

const { createPrismaClient } = require('../../db/db-client');
/** @type {import('@prisma/client').PrismaClient} */
let sqlClient = createPrismaClient();

const { isFeatureActive } = require('../../configuration/featureFlag');
// @ts-ignore (from mock, doesn't exist in express-oauth2-jwt-bearer)
const { setCurrentSub } = require('express-oauth2-jwt-bearer');
// @ts-ignore (from mock, /middleware/validate-token)
const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');

const supertest = require('supertest');
const app = require('../../app');

const fs = require('fs');
const path = require('path');

afterAll(async () => {
	await sqlClient.$disconnect();
});

beforeEach(() => {
	// turn all feature flags on
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterEach(() => {
	jest.resetAllMocks();
});

describe('integration tests', () => {
	const dependencies = {
		getSqlClient: () => {
			return sqlClient;
		},
		setCurrentSub,
		setCurrentLpa,
		appealsApi: supertest(app),
		mockNotifyClient,
		mockEventClient,
		mockBlobMetaGetter
	};

	/**
	 * collect all .spec.js files in the routes directory
	 * @param {string} dir
	 * @returns {string[]}
	 */
	function getAllSpecFiles(dir) {
		const files = fs.readdirSync(dir);
		/** @type {string[]} */
		let specFiles = [];
		for (const file of files) {
			const fullPath = path.join(dir, file);
			const stat = fs.statSync(fullPath);
			if (stat.isDirectory()) {
				specFiles = specFiles.concat(getAllSpecFiles(fullPath));
			} else if (file.endsWith('.spec.js')) {
				// example to only run 1 integration test at a time
				// if (!fullPath.includes('/appellant-submissions/_id/submit/index.spec.js')) continue;
				specFiles.push(fullPath);
			}
		}
		return specFiles;
	}

	getAllSpecFiles(__dirname).forEach((specFile) => {
		require(specFile)(dependencies);
	});
});
