const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const container = require('rhea');
const jp = require('jsonpath');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const { createPrismaClient } = require('../../src/db/db-client');

const MockedExternalApis = require('./external-dependencies/rest-apis/mocked-external-apis');
const HorizonInteraction = require('./external-dependencies/rest-apis/interactions/horizon-interaction');
const NotifyInteraction = require('./external-dependencies/rest-apis/interactions/notify-interaction');
const AppealFixtures = require('./fixtures/appeals');
const HorizonIntegrationInputCondition = require('./utils/horizon-integration-input-condition');

const { isFeatureActive } = require('../../src/configuration/featureFlag');

/** @type {import('@pins/database/src/client/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
/** @type {import('mongodb').MongoClient} */
let databaseConnection;
/** @type {import('./external-dependencies/rest-apis/mocked-external-apis')} */
let mockedExternalApis;
/** @type {Array.<*>} */
let expectedHorizonInteractions;
/** @type {Array.<*>} */
let expectedNotifyInteractions;
let testLpaEmail = 'appealplanningdecisiontest@planninginspectorate.gov.uk';
let testLpaCodeEngland = 'E69999999';
let testLpaCodeWales = 'W69999999';
let testLpaNameEngland = 'System Test Borough Council England';
let testLpaNameWales = 'System Test Borough Council Wales';
let testHorizonLpaCodeWales = 'H1234';

jest.setTimeout(240000); // The Horizon integration tests need a bit of time to complete! This seemed like a good number (4 mins)
jest.mock('../../src/db/db'); // TODO: We shouldn't need to do this, but we didn't have time to look at making this better. It should be possible to use the DB connection directly (not mock it)
jest.mock('../../src/configuration/featureFlag');
jest.mock('../../src/services/back-office-v2');
jest.mock('../../src/services/object-store');

const dbName = 'integration-test-back-office-db';

/** @type {Array.<string>} */
const userIds = [];
/** @type {Array.<string>} */
const appealIds = [];

beforeAll(async () => {
	///////////////////////////////
	///// SETUP EXTERNAL APIs /////
	///////////////////////////////

	mockedExternalApis = await MockedExternalApis.setup();

	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////
	if (!process.env.INTEGRATION_TEST_DB_URL) {
		throw new Error('process.env.INTEGRATION_TEST_DB_URL not set');
	}

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let mockedDatabase = await databaseConnection.db(dbName);
	appDbConnection.get.mockReturnValue(mockedDatabase);

	const test_listener = container.create_container();

	test_listener.on('disconnected', (context) => {
		context.connection.close();
	});

	// sql client
	sqlClient = createPrismaClient();

	/////////////////////////////
	///// SETUP TEST CONFIG /////
	/////////////////////////////
	appConfiguration.services.horizon.url = mockedExternalApis.getHorizonUrl();
	appConfiguration.services.notify.apiKey =
		'hasserviceapikey-u89q754j-s87j-1n35-s351-789245as890k-1545v789-8s79-0124-qwe7-j2vfds34w5nm';
	appConfiguration.services.notify.baseUrl = mockedExternalApis.getNotifyUrl();
	appConfiguration.services.notify.serviceId = 'g09j298f-q59t-9a34-f123-782342hj910l';
	appConfiguration.services.notify.templates.APPEAL_SUBMISSION.V1_HORIZON.appellantAppealSubmissionInitialConfirmation = 1;
	appConfiguration.services.notify.templates.APPEAL_SUBMISSION.V1_HORIZON.appellantAppealSubmissionFollowUpConfirmation = 7;
	appConfiguration.services.notify.templates['1001'].appealNotificationEmailToLpa = 2;
	appConfiguration.services.notify.templates['1005'].appealSubmissionConfirmationEmailToAppellant =
		3;
	appConfiguration.services.notify.templates['1005'].appealSubmissionReceivedEmailToAppellant = 8;
	appConfiguration.services.notify.templates['1005'].appealNotificationEmailToLpa = 4;
	appConfiguration.services.notify.templates.ERROR_MONITORING.failureToUploadToHorizon = 6;
	appConfiguration.services.notify.templates.generic = 7;
	appConfiguration.services.notify.emails.adminMonitoringEmail = 'test@pins.gov.uk';
	appConfiguration.documents.url = mockedExternalApis.getDocumentsAPIUrl();

	/////////////////////
	///// SETUP APP /////
	/////////////////////
	appealsApi = supertest(app);

	/////////////////////////
	///// POPULATE LPAS /////
	/////////////////////////

	const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaCodeEngland};;${testLpaNameEngland};${testLpaEmail};;TRUE\n324;${testLpaCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}`;
	await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);
});

beforeEach(async () => {
	await mockedExternalApis.clearAllMockedResponsesAndRecordedInteractions();
	jest.clearAllMocks();

	await _clearDatabaseCollections();
	expectedHorizonInteractions = [];
	expectedNotifyInteractions = [];
	await mockedExternalApis.mockNotifyResponse({}, 200);
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

// We check mock and message interactions consistently here so that they're not forgotten for each test :)
afterEach(async () => {
	// runs expect calls so may exit early
	await mockedExternalApis.checkInteractions(
		expectedHorizonInteractions,
		expectedNotifyInteractions
	);
});

afterAll(async () => {
	await sqlClient.$disconnect();
	await databaseConnection.close();
	await mockedExternalApis.teardown();
});

describe('Back Office', () => {
	describe('submit appeals', () => {
		const householderAppealConditions = [
			// NOTE: for householder appeals, neither an agent or appellant can add their company name (if they belong to one).
			//       Therefore, there are no tests here to check for system behaviour with such inputs.
			HorizonIntegrationInputCondition.get(),
			HorizonIntegrationInputCondition.get({
				description: 'no Horizon ID field',
				setHorizonIdFunction: (appeal) => {
					delete appeal.horizonId;
				}
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a Welsh LPA',
				lpaCode: testLpaCodeWales,
				horizonLpaCode: testHorizonLpaCodeWales
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a householder appeal where the appellant owns the whole site',
				appeal: AppealFixtures.newHouseholderAppeal({ ownsSite: true })
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a householder appeal where there is an agent appealling on behalf of an appellent',
				appeal: AppealFixtures.newHouseholderAppeal({ agentAppeal: true }),
				expectedContactRequests: [
					{
						email: { '__i:nil': 'true' },
						firstName: 'Appellant',
						lastName: 'Name',
						type: 'Appellant',
						orgId: null
					},
					{
						email: 'test@example.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: null
					}
				],
				expectedContactIdsInCreateAppealRequest: [`P_0`, `P_1`],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a refused householder appeal with a "householder" planning application',
				appeal: AppealFixtures.newHouseholderAppeal({
					decision: 'refused',
					planningApplicationType: 'householder-planning'
				}),
				expectedCaseworkReason: '1. Refused planning permission for the development'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a refused householder appeal with a "removal or variation of conditions" planning application',
				appeal: AppealFixtures.newHouseholderAppeal({
					decision: 'refused',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason: '2. Refused permission to vary or remove a condition(s)'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a refused householder appeal with a "prior approval" planning application',
				appeal: AppealFixtures.newHouseholderAppeal({
					decision: 'refused',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason: '3. Refused prior approval of permitted development rights'
			})
		];

		const fullAppealConditions = [
			HorizonIntegrationInputCondition.get({
				description: 'a full appeal where the appellant owns all the land',
				appeal: AppealFixtures.newFullAppeal({ ownsAllTheLand: true })
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a full appeal where the appellant is not an agent, and does have a company',
				appeal: AppealFixtures.newFullAppeal({ appellantCompanyName: 'Appellant Company Name' }),
				expectedContactRequests: [
					{
						firstName: 'Appellant',
						lastName: 'Name',
						email: 'test@example.com',
						type: 'Appellant',
						orgId: 'O_0'
					}
				],
				expectedOrganisationNamesInCreateOrganisationRequests: ['Appellant Company Name']
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a full appeal where there is an agent appealling on behalf of an appellent',
				appeal: AppealFixtures.newFullAppeal({ agentAppeal: true }),
				expectedContactRequests: [
					{
						email: { '__i:nil': 'true' },
						firstName: 'Appellant',
						lastName: 'Name',
						type: 'Appellant',
						orgId: null
					},
					{
						email: 'test@example.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: null
					}
				],
				expectedContactIdsInCreateAppealRequest: [`P_0`, `P_1`],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a full appeal where the appellant is an agent, and the agent belongs to a company, but the original appellant does not',
				appeal: AppealFixtures.newFullAppeal({
					agentAppeal: true,
					agentCompanyName: 'Agent Company Name'
				}),
				expectedContactRequests: [
					{
						email: { '__i:nil': 'true' },
						firstName: 'Appellant',
						lastName: 'Name',
						type: 'Appellant',
						orgId: null
					},
					{
						email: 'test@example.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: `O_0`
					}
				],
				expectedContactIdsInCreateAppealRequest: [`P_0`, `P_1`],
				expectedOrganisationNamesInCreateOrganisationRequests: ['Agent Company Name'],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a full appeal where the appellant is an agent, and the agent does not belong to a company, but the original appellant does',
				appeal: AppealFixtures.newFullAppeal({
					agentAppeal: true,
					appellantCompanyName: 'Appellant Company Name'
				}),
				expectedContactRequests: [
					{
						email: { '__i:nil': 'true' },
						firstName: 'Appellant',
						lastName: 'Name',
						type: 'Appellant',
						orgId: `O_0`
					},
					{
						email: 'test@example.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: null
					}
				],
				expectedContactIdsInCreateAppealRequest: [`P_0`, `P_1`],
				expectedOrganisationNamesInCreateOrganisationRequests: ['Appellant Company Name'],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a full appeal where the appellant is an agent, and the agent/original appellant belong to companies',
				appeal: AppealFixtures.newFullAppeal({
					agentAppeal: true,
					agentCompanyName: 'Agent Company Name',
					appellantCompanyName: 'Appellant Company Name'
				}),
				expectedContactRequests: [
					{
						email: { '__i:nil': 'true' },
						firstName: 'Appellant',
						lastName: 'Name',
						type: 'Appellant',
						orgId: `O_0`
					},
					{
						email: 'test@example.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: `O_1`
					}
				],
				expectedContactIdsInCreateAppealRequest: [`P_0`, `P_1`],
				expectedOrganisationNamesInCreateOrganisationRequests: [
					'Appellant Company Name',
					'Agent Company Name'
				],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a refused full appeal with a "planning" application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'full-appeal'
				}),
				expectedCaseworkReason: '1. Refused planning permission for the development'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a refused full appeal with a "removal or variation of conditions" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason: '2. Refused permission to vary or remove a condition(s)'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a refused full appeal with a "prior approval" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason: '3. Refused prior approval of permitted development rights'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "householder planning" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'householder-planning'
				}),
				expectedCaseworkReason:
					'4. Granted planning permission for the development subject to conditions to which you object'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "full appeal" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'full-appeal'
				}),
				expectedCaseworkReason:
					'4. Granted planning permission for the development subject to conditions to which you object'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "prior approval" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason:
					'4. Granted planning permission for the development subject to conditions to which you object'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a refused full appeal with an "outline planning" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'outline-planning'
				}),
				expectedCaseworkReason:
					'5. Refused approval of the matters reserved under an outline planning permission'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a refused full appeal with a "reserved matters" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'reserved-matters'
				}),
				expectedCaseworkReason:
					'5. Refused approval of the matters reserved under an outline planning permission'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a granted full appeal with an "outline planning" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'outline-planning'
				}),
				expectedCaseworkReason:
					'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "reserved matters" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'reserved-matters'
				}),
				expectedCaseworkReason:
					'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a granted full appeal with a "removal or variation of conditions" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason:
					'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "householder planning" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'householder-planning'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			HorizonIntegrationInputCondition.get({
				description: 'a no decision received full appeal with a "full appeal" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'full-appeal'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with an "outline planning" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'outline-planning'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "prior approval" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "reserved-matters" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'reserved-matters'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			HorizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "removal-or-variation-of-conditions" planning application',
				appeal: AppealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			})
		];

		it.each([...householderAppealConditions, ...fullAppealConditions])(
			'should submit an appeal to horizon and send emails to the appellant and case worker when horizon reports a success in upload for: $description',
			async (condition) => {
				// Given: that we use the Horizon integration back office strategy
				isFeatureActive.mockImplementation(() => {
					return true;
				});

				// And: an appeal is created on the server
				condition.setHorizonId(condition.appeal);
				condition.appeal.lpaCode = condition.lpa.code;
				const createAppealResponse = await _createAppeal(condition.appeal);
				let createdAppeal = createAppealResponse.body;

				// And: Horizon's create organisation endpoint is mocked, first for organisations, then contacts
				for (let i in condition.expectations.createOrganisationInHorizonRequests) {
					const mockedOrganisationId = `O_${i}`;
					await mockedExternalApis.mockHorizonCreateContactResponse(200, mockedOrganisationId);
				}

				for (let i in condition.expectations.createContactInHorizonRequests) {
					const mockedContactId = `P_${i}`;
					await mockedExternalApis.mockHorizonCreateContactResponse(200, mockedContactId);
				}

				// And: Horizon's create appeal endpoint is mocked
				const mockedCaseReference = 'APP/Z0116/D/20/3218465';
				await mockedExternalApis.mockHorizonCreateAppealResponse(200, mockedCaseReference);

				// And: the Document API amd Horizon are mocked to process all documents on the appeal successfully
				[
					...jp.query(condition.appeal, '$..uploadedFile').flat(Infinity),
					...jp.query(condition.appeal, '$..uploadedFiles').flat(Infinity)
				].forEach(async (document) => {
					await mockedExternalApis.mockDocumentsApiResponse(200, createdAppeal.id, document, true);
					await mockedExternalApis.mockHorizonUploadDocumentResponse(200, document);
				});

				// When: the appeal is tagged for submission to the back office
				const tagAppealAsSubmittedToBackOffice = await appealsApi.post(
					`/api/v1/back-office/appeals/${createdAppeal.id}`
				);

				// And: appeals ready for submission are then submitted to the back office
				const submitAppealsToBackOfficeResponse = await appealsApi.put(
					`/api/v1/back-office/appeals`
				);

				// And: the appeal is then retrieved from the appeals API
				const retrievedAppealResponse = await appealsApi.get(`/api/v1/appeals/${createdAppeal.id}`);

				// Then: the status code for the appeal being tagged for submission is 202
				expect(tagAppealAsSubmittedToBackOffice.status).toBe(202);

				// And: the status code for the submission request should be 202
				expect(submitAppealsToBackOfficeResponse.status).toBe(202);

				// Then: the status code for the appeal being tagged for submission is 202
				expect(tagAppealAsSubmittedToBackOffice.status).toBe(202);

				// And: the appeal should have been updated in the following ways:
				//      - Its `state` field should be updated
				//      - Its `submissionDate` field should be set
				//      - Its `updatedAt` field should be updated
				//      - Its `horizonId` field should be set to the last 7 digits of mockedCaseReference
				createdAppeal.state = 'SUBMITTED';
				createdAppeal.submissionDate = retrievedAppealResponse.body.submissionDate;
				createdAppeal.updatedAt = retrievedAppealResponse.body.updatedAt;
				createdAppeal.horizonId = '3218465';
				createdAppeal.horizonIdFull = mockedCaseReference;
				expect(retrievedAppealResponse.body).toMatchObject(createdAppeal);

				// And: Horizon has been interacted with as expected
				const createOrganisationInteractions =
					condition.expectations.createOrganisationInHorizonRequests.map((expectation) =>
						HorizonInteraction.getCreateOrganisationInteraction(expectation)
					);
				const createContactInteractions = condition.expectations.createContactInHorizonRequests.map(
					(expectation) => HorizonInteraction.getCreateContactInteraction(expectation)
				);
				const createAppealInteraction = HorizonInteraction.getCreateAppealInteraction(
					condition.expectations.createAppealInHorizonRequest
				);
				const createDocumentInteractions = [
					...jp.query(condition.appeal, '$..uploadedFile').flat(Infinity),
					...jp.query(condition.appeal, '$..uploadedFiles').flat(Infinity)
				].map((document) => {
					document.name = '&apos;&lt;&gt;test&amp;&quot;pdf.pdf'; // Check that bad characters have been sanitised
					return HorizonInteraction.getCreateDocumentInteraction(
						mockedCaseReference.slice(-7),
						document,
						true
					);
				});

				expectedHorizonInteractions = [
					...createOrganisationInteractions,
					...createContactInteractions,
					createAppealInteraction,
					...createDocumentInteractions
				];

				// And: Notify has been interacted with as expected
				const emailToAppellantInteraction =
					NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(condition.appeal);
				condition.appeal.horizonId = createdAppeal.horizonId;
				condition.appeal.horizonIdFull = mockedCaseReference;
				const emailToReceivedAppellantInteraction =
					NotifyInteraction.getAppealReceivedEmailForAppellantInteraction(
						condition.appeal,
						condition.lpa.name
					);
				const emailToLpaInteraction = NotifyInteraction.getAppealSubmittedEmailForLpaInteraction(
					condition.appeal,
					condition.lpa.name,
					condition.lpa.email
				);

				expectedNotifyInteractions = [
					emailToAppellantInteraction,
					emailToLpaInteraction,
					emailToReceivedAppellantInteraction
				];
			}
		);
	});
});

const _createAppeal = async (appeal = AppealFixtures.newHouseholderAppeal()) => {
	const appealCreatedResponse = await appealsApi.post('/api/v1/appeals');
	const appealCreated = appealCreatedResponse.body;

	appealIds.push(appealCreated.appealSqlId);

	await _createSqlUser(appeal.email);

	appeal.id = appealCreated.id;
	const savedAppealResponse = await appealsApi
		.put(`/api/v1/appeals/${appealCreated.id}`)
		.send(appeal);

	return savedAppealResponse;
};

/**
 * Clears out all collection from the database EXCEPT the LPA collection, since this is needed
 * from one test to the next, and its data does not change during any test execution.
 */
const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();

	const databaseCollectionsFiltered = databaseCollections.filter(
		(collection) => collection.namespace.split('.')[1] !== 'lpa'
	);

	for (const collection of databaseCollectionsFiltered) {
		await collection.drop();
	}
};

/**
 *
 * @param {string} email
 * @returns {Promise.<import('@pins/database/src/client/client').AppealUser>}
 */
const _createSqlUser = async (email) => {
	const user = await sqlClient.appealUser.upsert({
		create: {
			email: email,
			isEnrolled: true
		},
		update: {
			isEnrolled: true
		},
		where: { email: email }
	});

	userIds.push(user.id);

	return user;
};
