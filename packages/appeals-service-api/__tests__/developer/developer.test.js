const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const container = require('rhea');
const uuid = require('uuid');
const crypto = require('crypto');
const jp = require('jsonpath');
// const logger = require('../../src/lib/logger');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const MockedExternalApis = require('./external-dependencies/rest-apis/mocked-external-apis');
const HorizonInteraction = require('./external-dependencies/rest-apis/interactions/horizon-interaction');
const NotifyInteraction = require('./external-dependencies/rest-apis/interactions/notify-interaction');
const AppealFixtures = require('./fixtures/appeals');
const FinalCommentFixtures = require('./fixtures/finalComments');
const HorizonIntegrationInputCondition = require('./utils/horizon-integration-input-condition');

const { isFeatureActive } = require('../../src/configuration/featureFlag');

let appealsApi;
let databaseConnection;
let mockedExternalApis;
let expectedHorizonInteractions;
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

beforeAll(async () => {
	///////////////////////////////
	///// SETUP EXTERNAL APIs /////
	///////////////////////////////

	mockedExternalApis = await MockedExternalApis.setup();

	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let mockedDatabase = await databaseConnection.db('foo');
	appDbConnection.get.mockReturnValue(mockedDatabase);

	const test_listener = container.create_container();

	test_listener.on('disconnected', (context) => {
		context.connection.close();
	});

	/////////////////////////////
	///// SETUP TEST CONFIG /////
	/////////////////////////////

	appConfiguration.secureCodes.finalComments.length = 4;
	appConfiguration.secureCodes.finalComments.expirationTimeInMinutes = 30;
	appConfiguration.secureCodes.finalComments.decipher.algorithm = 'aes-256-cbc';
	appConfiguration.secureCodes.finalComments.decipher.initVector = crypto.randomBytes(16);
	appConfiguration.secureCodes.finalComments.decipher.securityKey = crypto.randomBytes(32);
	appConfiguration.secureCodes.finalComments.decipher.inputEncoding = 'hex';
	appConfiguration.secureCodes.finalComments.decipher.outputEncoding = 'utf-8';
	appConfiguration.services.horizon.url = mockedExternalApis.getHorizonUrl();
	appConfiguration.services.notify.apiKey =
		'hasserviceapikey-u89q754j-s87j-1n35-s351-789245as890k-1545v789-8s79-0124-qwe7-j2vfds34w5nm';
	appConfiguration.services.notify.baseUrl = mockedExternalApis.getNotifyUrl();
	appConfiguration.services.notify.serviceId = 'g09j298f-q59t-9a34-f123-782342hj910l';
	appConfiguration.services.notify.templates[
		'1001'
	].appealSubmissionConfirmationEmailToAppellant = 1;
	appConfiguration.services.notify.templates['1001'].appealNotificationEmailToLpa = 2;
	appConfiguration.services.notify.templates[
		'1005'
	].appealSubmissionConfirmationEmailToAppellant = 3;
	appConfiguration.services.notify.templates['1005'].appealNotificationEmailToLpa = 4;
	appConfiguration.services.notify.templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant = 5;
	appConfiguration.services.notify.templates.ERROR_MONITORING.failureToUploadToHorizon = 6;
	appConfiguration.services.notify.emails.adminMonitoringEmail = 'test@pins.gov.uk';
	appConfiguration.documents.url = mockedExternalApis.getDocumentsAPIUrl();

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);

	/////////////////////////
	///// POPULATE LPAS /////
	/////////////////////////

	const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaCodeEngland};;${testLpaNameEngland};${testLpaEmail};;TRUE\n324;${testLpaCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}`;
	await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);
});

beforeEach(async () => {
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
	await mockedExternalApis.checkInteractions(
		expectedHorizonInteractions,
		expectedNotifyInteractions
	);
	await mockedExternalApis.clearAllMockedResponsesAndRecordedInteractions();
	jest.clearAllMocks(); // We need to do this so that mock interactions are reset correctly between tests :)
});

afterAll(async () => {
	await databaseConnection.close();
	await mockedExternalApis.teardown();
});

describe('Appeals', () => {
	it(`should return an error if we try to update an appeal that doesn't exist`, async () => {
		// When: an appeal is sent via a PUT or PATCH request, but hasn't yet been created
		const householderAppeal = AppealFixtures.newHouseholderAppeal(uuid.v4());
		const putResponse = await appealsApi
			.put(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		const patchResponse = await appealsApi
			.patch(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		// Then: we should get a 404 status code for both requests
		expect(putResponse.status).toBe(404);
		expect(patchResponse.status).toBe(404);

		// And: external systems should be interacted with in the following ways
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});

	it("should apply patch updates correctly when data to patch-in isn't a full appeal", async () => {
		// Given: an appeal is created
		const savedAppealResponse = await _createAppeal();
		let savedAppeal = savedAppealResponse.body;

		// When: the appeal is patched
		const patchedAppealResponse = await appealsApi
			.patch(`/api/v1/appeals/${savedAppeal.id}`)
			.send({ horizonId: 'foo' });

		// Then: when we retrieve the appeal, it should have the patch applied
		savedAppeal.horizonId = 'foo';
		savedAppeal.updatedAt = patchedAppealResponse.body.updatedAt;
		expect(patchedAppealResponse.body).toMatchObject(savedAppeal);

		// And: no external systems should be interacted with
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});

	it('should return the relevant appeal when requested after the appeal has been saved', async () => {
		// Given: an appeal is created
		const savedAppeal = await _createAppeal();

		// When: we try to request that appeal
		const requestedAppeal = await appealsApi.get(`/api/v1/appeals/${savedAppeal.body.id}`);

		// Then: we should get a 200 status
		expect(requestedAppeal.status).toEqual(200);

		// And: the correct appeal should be returned
		expect(requestedAppeal.body.id).toEqual(savedAppeal.body.id);

		// And: external systems should be interacted with in the following ways
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});

	it(`should return an error if an appeal is requested that doesn't exist`, async () => {
		// When: we try to access a non-existent appeal
		const getAppealResponse = await appealsApi.get(`/api/v1/appeals/${uuid.v4()}`);

		// Then: we should get a 404 status
		expect(getAppealResponse.status).toEqual(404);

		// And: external systems should be interacted with in the following ways
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});
});

describe('Back Office', () => {
	describe('submit appeals', () => {
		it.skip('should send an email to the appellant when the appeal is loaded for submission to the back-office', async () => {
			// Given: that we use the Horizon integration back office strategy
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// Given: an appellant creates a full appeal on the server with an agent and appellant specified
			const inputAppeal = AppealFixtures.newFullAppeal({
				agentAppeal: true,
				agentCompanyName: 'Agent Company Name',
				appellantCompanyName: 'Appellant Company Name'
			});
			const createdAppealResponse = await _createAppeal(inputAppeal);
			const createdAppeal = createdAppealResponse.body;

			// When: this appeal is loaded for back-office submission
			const response = await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);

			// Then: the response should report a 202 status code
			expect(response.status).toBe(202);

			// And: the response body will be empty
			expect(response.body).toEqual({});

			// And: an email will be sent to the appellant via Notify
			const emailSentToAppellantInteraction =
				NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
					createdAppeal,
					'Agent Name',
					testLpaNameEngland
				);
			expectedNotifyInteractions.push(emailSentToAppellantInteraction);

			// And: Horizon will not be interacted with
			expectedHorizonInteractions = [];
		});

		it.skip('should return a 409 if the direct Horizon integration is being used, and an appeal is loaded for submission twice', async () => {
			// Given: that we use the Horizon integration back office strategy
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// Given: an appellant creates a full appeal on the server with an agent and appellant specified
			const inputAppeal = AppealFixtures.newFullAppeal({
				agentAppeal: true,
				agentCompanyName: 'Agent Company Name',
				appellantCompanyName: 'Appellant Company Name'
			});
			const createdAppealResponse = await _createAppeal(inputAppeal);
			const createdAppeal = createdAppealResponse.body;

			// When: this appeal is loaded for back-office submission twice
			await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);
			const response = await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);

			// Then: the response should report a 409 status code
			expect(response.status).toBe(409);

			// And: the response body will be empty
			expect(response.body[0]).toEqual('Cannot update appeal that is already SUBMITTED');

			// And: an email will be sent to the appellant via Notify for the first submission
			const emailSentToAppellantInteraction =
				NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
					createdAppeal,
					'Agent Name',
					testLpaNameEngland
				);
			expectedNotifyInteractions.push(emailSentToAppellantInteraction);

			// And: Horizon will not be interacted with
			expectedHorizonInteractions = [];
		});

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
				description: 'a refused full appeal with a "full planning" planning application',
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
					NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
						condition.appeal,
						condition.expectations.emailToAppellant.name,
						condition.lpa.name
					);
				condition.appeal.horizonId = createdAppeal.horizonId;
				const emailToLpaInteraction = NotifyInteraction.getAppealSubmittedEmailForLpaInteraction(
					condition.appeal,
					condition.lpa.name,
					condition.lpa.email
				);

				expectedNotifyInteractions = [emailToAppellantInteraction, emailToLpaInteraction];
			}
		);

		it.skip('should attempt to re-process all appeals that failed to be uploaded when the `process appeals to be submitted` behaviour is triggered', async () => {
			// Given: that we are using the direct Horizon integration
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: we have two full appeals that each have an agent and appellant specified, along with organisations
			let inputs = {
				appealThatWillEventuallySucceed: null
			};

			for (const key in inputs) {
				inputs[key] = HorizonIntegrationInputCondition.get({
					description: `Appeal ${key}`,
					appeal: AppealFixtures.newFullAppeal({
						agentAppeal: true,
						agentCompanyName: 'Agent Company Name',
						appellantCompanyName: 'Appellant Company Name'
					}),
					expectedOrganisationNamesInCreateOrganisationRequests: [
						'Appellant Company Name',
						'Agent Company Name'
					],
					expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name',
					expectedContactRequests: [
						{
							firstName: 'Appellant',
							lastName: 'Name',
							email: { '__i:nil': 'true' },
							type: 'Appellant',
							orgId: `APPELLANT_ORG_${key}`
						},
						{
							firstName: 'Agent',
							lastName: 'Name',
							email: 'test@example.com',
							type: 'Agent',
							orgId: `AGENT_ORG_${key}`
						}
					],
					expectedContactIdsInCreateAppealRequest: [
						`APPELLANT_CONTACT_${key}`,
						`AGENT_CONTACT_${key}`
					]
				});
			}

			const expectations = {
				createOrganisationAndContactRequests: [],
				createCoreAppealAndDocumentRequests: []
			};

			// And: these are loaded for submission to the back-office
			for (const key in inputs) {
				const createdAppealResponse = await _createAppeal(inputs[key].appeal);
				const createdAppeal = createdAppealResponse.body;
				await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);
			}

			// And: we expect an email to be sent to the appellant for every appeal
			//      since the "loading for submission" phase of each appeal will be successful.
			for (const key in inputs) {
				expectedNotifyInteractions.push(
					NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
						inputs[key].appeal,
						inputs[key].expectations.emailToAppellant.name,
						inputs[key].lpa.name
					)
				);
			}

			////////////////////
			// logger.debug('First back-office submission attempt for appeals');

			// And: on the first attempt to submit, the attempt to create
			//      the agent and appellant organisations will fail for both appeals
			// eslint-disable-next-line no-unused-vars
			for (const key in inputs) {
				// logger.debug(`Calling Horizon's create organisations for ${key}`);
				await mockedExternalApis.mockHorizonCreateContactResponse(500);
				await mockedExternalApis.mockHorizonCreateContactResponse(500);
			}

			// When: we trigger the submission of the appeals to the back-office
			await appealsApi.put(`/api/v1/back-office/appeals`);

			// Then: we expect that neither appeal will have a Horizon case ID
			for (const key in inputs) {
				const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
				expect(appealResponse.body.horizonId).toBeFalsy();
			}

			// And: only 4 create organisation requests to Horizon will have been made
			for (const key in inputs) {
				inputs[key].expectations.createOrganisationInHorizonRequests.forEach((expectation) =>
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateOrganisationInteraction(expectation)
					)
				);
			}

			////////////////////
			// logger.debug('Second back-office submission attempt for appeals');

			// Given: that the appellant organisation will now upload successfully for the first appeal, but the
			//        agent's organisation request will not upload successfully.
			await mockedExternalApis.mockHorizonCreateContactResponse(
				200,
				`APPELLANT_ORG_appealThatWillEventuallySucceed`
			);
			await mockedExternalApis.mockHorizonCreateContactResponse(500);

			// And: the appellant's contact details for the first appeal will not upload successfully
			await mockedExternalApis.mockHorizonCreateContactResponse(500);

			// When: we trigger the submission of the appeals to the back-office
			await appealsApi.put(`/api/v1/back-office/appeals`);

			// Then: we expect that neither appeal will have a Horizon case ID
			for (const key in inputs) {
				const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
				expect(appealResponse.body.horizonId).toBeFalsy();
			}

			// And: for the first appeal, 2 create organisation requests to Horizon will have been made, along with
			//      one for the agent's contact details.
			inputs.appealThatWillEventuallySucceed.expectations.createOrganisationInHorizonRequests.forEach(
				(expectation) =>
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateOrganisationInteraction(expectation)
					)
			);

			const expectedCreateContactRequestForFirstAppeal =
				inputs.appealThatWillEventuallySucceed.expectations.createContactInHorizonRequests[0];
			expectations.createOrganisationAndContactRequests.push(
				HorizonInteraction.getCreateContactInteraction(expectedCreateContactRequestForFirstAppeal)
			);

			////////////////////
			// logger.debug('Third back-office submission attempt for appeals');

			// Given: that the create agent organisation and create appellant contact requests will now succeed
			//        for the first appeal, but the create agent contact request will fail
			await mockedExternalApis.mockHorizonCreateContactResponse(
				200,
				`AGENT_ORG_appealThatWillEventuallySucceed`
			);
			await mockedExternalApis.mockHorizonCreateContactResponse(
				200,
				`APPELLANT_CONTACT_appealThatWillEventuallySucceed`
			);
			await mockedExternalApis.mockHorizonCreateContactResponse(500);

			// When: we trigger the submission of the appeals to the back-office
			await appealsApi.put(`/api/v1/back-office/appeals`);

			// Then: we expect that neither appeal will have a Horizon case ID
			for (const key in inputs) {
				const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
				expect(appealResponse.body.horizonId).toBeFalsy();
			}

			// And: for the first appeal
			//      - 1 create organisation request to Horizon will have been made for the agent's organisation
			//      - 2 create contact requests to Horizon will have been made for the appellant and agent contact details.
			const expectedCreateAgentOrganisationRequest =
				inputs.appealThatWillEventuallySucceed.expectations.createOrganisationInHorizonRequests[1];
			expectations.createOrganisationAndContactRequests.push(
				HorizonInteraction.getCreateOrganisationInteraction(expectedCreateAgentOrganisationRequest)
			);

			inputs.appealThatWillEventuallySucceed.expectations.createContactInHorizonRequests.forEach(
				(expectation) => {
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateContactInteraction(expectation)
					);
				}
			);

			////////////////////
			// logger.debug('Fourth back-office submission attempt for appeals');

			// Given: that the create agent contact request will now succeed for the first appeal,
			//        but the create core appeal request will fail
			await mockedExternalApis.mockHorizonCreateContactResponse(
				200,
				`AGENT_CONTACT_appealThatWillEventuallySucceed`
			);
			await mockedExternalApis.mockHorizonCreateAppealResponse(500);

			// When: we trigger the submission of the appeals to the back-office
			await appealsApi.put(`/api/v1/back-office/appeals`);

			// Then: we expect that neither appeal will have a Horizon case ID
			for (const key in inputs) {
				const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
				expect(appealResponse.body.horizonId).toBeFalsy();
			}

			// And: for the first appeal
			//      - 1 create contact request to Horizon will have been made for the agent's contact details.
			//      - 1 create core appeal data request to Horizon will have been made
			const expectedCreateAgentContactRequest =
				inputs.appealThatWillEventuallySucceed.expectations.createContactInHorizonRequests[1];
			expectations.createOrganisationAndContactRequests.push(
				HorizonInteraction.getCreateContactInteraction(expectedCreateAgentContactRequest)
			);

			const expectedCreateCoreAppealDataRequest =
				inputs.appealThatWillEventuallySucceed.expectations.createAppealInHorizonRequest;
			expectations.createCoreAppealAndDocumentRequests.push(
				HorizonInteraction.getCreateAppealInteraction(expectedCreateCoreAppealDataRequest)
			);

			////////////////////
			// logger.debug('Fifth back-office submission attempt for appeals');

			// Given: that the create core appeal request will now succeed, but the even numbered documents
			//        on the appeal will not be sucessfully uploaded for the first appeal
			await mockedExternalApis.mockHorizonCreateAppealResponse(
				200,
				'CASE_REF_appealThatWillEventuallySucceed'
			);
			const appealDocuments = [
				...jp
					.query(inputs.appealThatWillEventuallySucceed.appeal, '$..uploadedFile')
					.flat(Infinity),
				...jp
					.query(inputs.appealThatWillEventuallySucceed.appeal, '$..uploadedFiles')
					.flat(Infinity)
			];
			for (let documentIndex = 0; documentIndex < appealDocuments.length; documentIndex++) {
				const document = appealDocuments[documentIndex];
				await mockedExternalApis.mockDocumentsApiResponse(
					200,
					inputs.appealThatWillEventuallySucceed.appeal.id,
					document,
					true
				); // ...no matter what, the appeal docs can be downloaded for submission to the back-office...
				let statusCode = 200;
				if (documentIndex % 2 == 0) statusCode = 500;
				await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
			}

			// When: we trigger the submission of the appeals to the back-office
			await appealsApi.put(`/api/v1/back-office/appeals`);

			// Then: we expect that neither appeal will have a Horizon case ID
			for (const key in inputs) {
				const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
				expect(appealResponse.body.horizonId).toBeFalsy();
			}

			// And: for the first appeal:
			//      - 1 create core appeal data request will have been made
			//      - x create document requests will have been made where x = the total number of documents on the first appeal
			expectations.createCoreAppealAndDocumentRequests.push(
				HorizonInteraction.getCreateAppealInteraction(expectedCreateCoreAppealDataRequest)
			);
			appealDocuments.forEach((document) => {
				document.name = '&apos;&lt;&gt;test&amp;&quot;pdf.pdf'; // Check that bad characters have been sanitised
				expectations.createCoreAppealAndDocumentRequests.push(
					HorizonInteraction.getCreateDocumentInteraction(
						`CASE_REF_appealThatWillEventuallySucceed`,
						document,
						true
					)
				);
			});

			////////////////////
			// logger.debug('Sixth back-office submission attempt for appeals');

			// Given: the even numbered documents on the first appeal will now be sucessfully uploaded
			for (let documentIndex = 0; documentIndex < appealDocuments.length; documentIndex++) {
				if (documentIndex % 2 == 0) {
					const document = appealDocuments[documentIndex];
					await mockedExternalApis.mockDocumentsApiResponse(
						200,
						inputs.appealThatWillEventuallySucceed.appeal.id,
						document,
						true
					);
					await mockedExternalApis.mockHorizonUploadDocumentResponse(200, document);
				}
			}

			// When: we trigger the submission of the appeals to the back-office
			await appealsApi.put(`/api/v1/back-office/appeals`);

			// Then: we expect that the first appeal will now have a Horizon case ID, but the second will not
			for (const key in inputs) {
				const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);

				if (key == 'appealThatWillEventuallySucceed')
					expect(appealResponse.body.horizonId).toBe('CASE_REF_appealThatWillEventuallySucceed');
				else expect(appealResponse.body.horizonId).toBeFalsy();
				inputs[key].appeal.horizonId = appealResponse.body.horizonId;
			}

			// And: for the first appeal:
			//      - x create document requests will have been made where x = the total number of even numbered documents on the first appeal
			for (let documentIndex = 0; documentIndex < appealDocuments.length; documentIndex++) {
				if (documentIndex % 2 == 0) {
					const document = appealDocuments[documentIndex];
					document.name = '&apos;&lt;&gt;test&amp;&quot;pdf.pdf'; // Check that bad characters have been sanitised
					expectations.createCoreAppealAndDocumentRequests.push(
						HorizonInteraction.getCreateDocumentInteraction(
							`CASE_REF_appealThatWillEventuallySucceed`,
							document,
							true
						)
					);
				}
			}

			// And: we expect an email to have been sent to the LPA for the first appeal since it has now been successfully
			//      processed
			expectedNotifyInteractions.push(
				NotifyInteraction.getAppealSubmittedEmailForLpaInteraction(
					inputs.appealThatWillEventuallySucceed.appeal,
					inputs.appealThatWillEventuallySucceed.lpa.name,
					inputs.appealThatWillEventuallySucceed.lpa.email
				)
			);

			// NOTE: we need to add the create contact requests and organisation requests for every appeal first, then
			// go on to add the appeal and document requests afterwards since MockServer can only return interactions
			// on a per-endpoint basis. Therefore, since create orgs/contacts are catered for by the same endpoint in
			// Horizon (and likewise for appeal/documents), the interactions returned by the MockServer look like:
			//
			// - appeal 1, org 1
			// - appeal 1, org 2
			// - appeal 1, contact 1
			// - appeal 1, contact 2
			// - appeal 2, org 1
			// ...
			// - appeal 1, appeal data
			// - appeal 1, doc 1
			// - ...
			// - appeal 2, appeal data
			// - appeal 2, doc 1
			// ....
			//
			// Rather than (what we would expect):
			//
			// - appeal 1, org 1
			// - appeal 1, org 2
			// - appeal 1, contact 1
			// - appeal 1, contact 2
			// - appeal 1, appeal data
			// - appeal 1, doc 1
			// - appeal 1, doc 2
			// - ...
			// - appeal 2, org 1
			// - appeal 2, org 2
			// - appeal 2, contact 1
			// - appeal 2, contact 2
			// - appeal 2, appeal data
			// - appeal 2, doc 1
			// - appeal 2, doc 2
			// - ...
			expectations.createOrganisationAndContactRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
			expectations.createCoreAppealAndDocumentRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
		});

		it.skip('should move all appeals to submit after 3 attempts to re-submit Organisations to the dead-letter queue', async () => {
			// Given: that we are using the direct Horizon integration
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: we create an appeal:
			//		  * 1 that will fail 3 times to uplaod an organisation
			let inputs = {
				appealThatWillFailOrg: null
			};

			for (const key in inputs) {
				inputs[key] = HorizonIntegrationInputCondition.get({
					description: `Appeal ${key}`,
					appeal: AppealFixtures.newFullAppeal({
						agentAppeal: true,
						agentCompanyName: 'Agent Company Name',
						appellantCompanyName: 'Appellant Company Name'
					}),
					expectedOrganisationNamesInCreateOrganisationRequests: [
						'Appellant Company Name',
						'Agent Company Name'
					],
					expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name',
					expectedContactRequests: [
						{
							firstName: 'Appellant',
							lastName: 'Name',
							email: { '__i:nil': 'true' },
							type: 'Appellant',
							orgId: `APPELLANT_ORG_${key}`
						},
						{
							firstName: 'Agent',
							lastName: 'Name',
							email: 'test@example.com',
							type: 'Agent',
							orgId: `AGENT_ORG_${key}`
						}
					],
					expectedContactIdsInCreateAppealRequest: [
						`APPELLANT_CONTACT_${key}`,
						`AGENT_CONTACT_${key}`
					]
				});
			}

			const expectations = {
				createOrganisationAndContactRequests: [],
				createCoreAppealAndDocumentRequests: []
			};

			// And: these are loaded for submission to the back-office
			for (const key in inputs) {
				const createdAppealResponse = await _createAppeal(inputs[key].appeal);
				const createdAppeal = createdAppealResponse.body;
				await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);
			}

			// And: we expect an email to be sent to the appellant for every appeal
			//      since the "loading for submission" phase of each appeal will be successful.
			for (const key in inputs) {
				expectedNotifyInteractions.push(
					NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
						inputs[key].appeal,
						inputs[key].expectations.emailToAppellant.name,
						inputs[key].lpa.name
					)
				);
			}
			// And: we expect a failure email to be sent once with the initial _id
			for (const key in inputs) {
				const originalBackOfficeAppealResponse = await appealsApi.get(
					`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
				);
				expectedNotifyInteractions.push(
					NotifyInteraction.getFailureToUploadToHorizonEmailInteraction(
						originalBackOfficeAppealResponse.body.appeal.id
					)
				);
			}

			// And: when submitting the appeal it will fail to upload organisation 3 times:
			for (const key in inputs) {
				// logger.debug(`Attempting to upload ${key} 3 times`);
				for (let attempts = 1; attempts <= 3; attempts++) {
					await mockedExternalApis.mockHorizonCreateContactResponse(500);
					await mockedExternalApis.mockHorizonCreateContactResponse(500);

					// When: we trigger the submission of the appeals to the back-office 3 times
					await appealsApi.put(`/api/v1/back-office/appeals`);

					// And: we query the back-end:
					const backOfficeAppealResponse = await appealsApi.get(
						`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
					);

					if (attempts < 3) {
						expect(backOfficeAppealResponse.status).toBe(202); // ...on the first 2 attempts the appeal will remain in the back office
					} else {
						expect(backOfficeAppealResponse.status).toBe(404); // ...on the 3rd attempt the appeal will no longer be in the back office

						// And: when querying the failed appeals, the appeal will be found
						const failedAppealResponse = await appealsApi.get(
							`/api/v1/for-manual-intervention/appeals/${inputs[key].appeal.id}`
						);
						expect(failedAppealResponse.status).toBe(202);
					}
					// And: we expect that appeal will not have a Horizon case ID
					const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
					expect(appealResponse.body.horizonId).toBeFalsy();

					// And: only 6 create organisation requests to Horizon will have been made
					inputs[key].expectations.createOrganisationInHorizonRequests.forEach((expectation) =>
						expectations.createOrganisationAndContactRequests.push(
							HorizonInteraction.getCreateOrganisationInteraction(expectation)
						)
					);
				}
			}

			expectations.createOrganisationAndContactRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
		});

		it.skip('should move all appeals to submit after 3 attempts to re-submit Contacts to the dead-letter queue', async () => {
			// Given: that we are using the direct Horizon integration
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: we create an appeal:
			//		  * 1 that will fail 3 times to uplaod an organisation
			let inputs = {
				appealThatWillFailContacts: null
			};

			for (const key in inputs) {
				inputs[key] = HorizonIntegrationInputCondition.get({
					description: `Appeal ${key}`,
					appeal: AppealFixtures.newFullAppeal({
						agentAppeal: true,
						agentCompanyName: 'Agent Company Name',
						appellantCompanyName: 'Appellant Company Name'
					}),
					expectedOrganisationNamesInCreateOrganisationRequests: [
						'Appellant Company Name',
						'Agent Company Name'
					],
					expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name',
					expectedContactRequests: [
						{
							firstName: 'Appellant',
							lastName: 'Name',
							email: { '__i:nil': 'true' },
							type: 'Appellant',
							orgId: `APPELLANT_ORG_${key}`
						},
						{
							firstName: 'Agent',
							lastName: 'Name',
							email: 'test@example.com',
							type: 'Agent',
							orgId: `AGENT_ORG_${key}`
						}
					],
					expectedContactIdsInCreateAppealRequest: [
						`APPELLANT_CONTACT_${key}`,
						`AGENT_CONTACT_${key}`
					]
				});
			}

			const expectations = {
				createOrganisationAndContactRequests: [],
				createCoreAppealAndDocumentRequests: []
			};

			// And: these are loaded for submission to the back-office
			for (const key in inputs) {
				const createdAppealResponse = await _createAppeal(inputs[key].appeal);
				const createdAppeal = createdAppealResponse.body;
				await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);
			}

			// And: we expect an email to be sent to the appellant for every appeal
			//      since the "loading for submission" phase of each appeal will be successful.
			for (const key in inputs) {
				expectedNotifyInteractions.push(
					NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
						inputs[key].appeal,
						inputs[key].expectations.emailToAppellant.name,
						inputs[key].lpa.name
					)
				);
			}
			// And: we expect a failure email to be sent once with the initial _id
			for (const key in inputs) {
				const originalBackOfficeAppealResponse = await appealsApi.get(
					`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
				);
				expectedNotifyInteractions.push(
					NotifyInteraction.getFailureToUploadToHorizonEmailInteraction(
						originalBackOfficeAppealResponse.body.appeal.id
					)
				);
			}

			// And: when submitting the appeal it will fail to upload organisation 3 times:
			for (const key in inputs) {
				//successfully upload Organisations
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'APPELLANT_ORG_appealThatWillFailContacts'
				);
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'AGENT_ORG_appealThatWillFailContacts'
				);
				inputs[key].expectations.createOrganisationInHorizonRequests.forEach((expectation) =>
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateOrganisationInteraction(expectation)
					)
				);
				// logger.debug(`Attempting to upload ${key} 3 times`);
				for (let attempts = 1; attempts <= 3; attempts++) {
					await mockedExternalApis.mockHorizonCreateContactResponse(500);
					await mockedExternalApis.mockHorizonCreateContactResponse(500);

					// When: we trigger the submission of the appeals to the back-office 3 times
					await appealsApi.put(`/api/v1/back-office/appeals`);

					// And: we query the back-end:
					const backOfficeAppealResponse = await appealsApi.get(
						`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
					);

					if (attempts < 3) {
						expect(backOfficeAppealResponse.status).toBe(202); // ...on the first 2 attempts the appeal will remain in the back office
					} else {
						expect(backOfficeAppealResponse.status).toBe(404); // ...on the 3rd attempt the appeal will no longer be in the back office

						// And: when querying the failed appeals, the appeal will be found
						const failedAppealResponse = await appealsApi.get(
							`/api/v1/for-manual-intervention/appeals/${inputs[key].appeal.id}`
						);
						expect(failedAppealResponse.status).toBe(202);
					}
					// And: we expect that appeal will not have a Horizon case ID
					const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
					expect(appealResponse.body.horizonId).toBeFalsy();
					inputs[key].expectations.createContactInHorizonRequests.forEach((expectation) =>
						expectations.createOrganisationAndContactRequests.push(
							HorizonInteraction.getCreateContactInteraction(expectation)
						)
					);
				}
			}
			expectations.createOrganisationAndContactRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
		});

		it.skip('should move all appeals to submit after 3 attempts to re-submit Appeal data to the dead-letter queue', async () => {
			// Given: that we are using the direct Horizon integration
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: we create an appeal:
			//		  * 1 that will fail 3 times to uplaod an organisation
			let inputs = {
				appealThatWillFailAppeal: null
			};

			for (const key in inputs) {
				inputs[key] = HorizonIntegrationInputCondition.get({
					description: `Appeal ${key}`,
					appeal: AppealFixtures.newFullAppeal({
						agentAppeal: true,
						agentCompanyName: 'Agent Company Name',
						appellantCompanyName: 'Appellant Company Name'
					}),
					expectedOrganisationNamesInCreateOrganisationRequests: [
						'Appellant Company Name',
						'Agent Company Name'
					],
					expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name',
					expectedContactRequests: [
						{
							firstName: 'Appellant',
							lastName: 'Name',
							email: { '__i:nil': 'true' },
							type: 'Appellant',
							orgId: `APPELLANT_ORG_${key}`
						},
						{
							firstName: 'Agent',
							lastName: 'Name',
							email: 'test@example.com',
							type: 'Agent',
							orgId: `AGENT_ORG_${key}`
						}
					],
					expectedContactIdsInCreateAppealRequest: [
						`APPELLANT_CONTACT_${key}`,
						`AGENT_CONTACT_${key}`
					]
				});
			}

			const expectations = {
				createOrganisationAndContactRequests: [],
				createCoreAppealAndDocumentRequests: []
			};

			// And: these are loaded for submission to the back-office
			for (const key in inputs) {
				const createdAppealResponse = await _createAppeal(inputs[key].appeal);
				const createdAppeal = createdAppealResponse.body;
				await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);
			}

			// And: we expect an email to be sent to the appellant for every appeal
			//      since the "loading for submission" phase of each appeal will be successful.
			for (const key in inputs) {
				expectedNotifyInteractions.push(
					NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
						inputs[key].appeal,
						inputs[key].expectations.emailToAppellant.name,
						inputs[key].lpa.name
					)
				);
			}
			// And: we expect a failure email to be sent once with the initial _id
			for (const key in inputs) {
				const originalBackOfficeAppealResponse = await appealsApi.get(
					`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
				);
				expectedNotifyInteractions.push(
					NotifyInteraction.getFailureToUploadToHorizonEmailInteraction(
						originalBackOfficeAppealResponse.body.appeal.id
					)
				);
			}

			// And: when submitting the appeal it will fail to upload appeal data 3 times:
			for (const key in inputs) {
				//successfully upload Organisations
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'APPELLANT_ORG_appealThatWillFailAppeal'
				);
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'AGENT_ORG_appealThatWillFailAppeal'
				);
				inputs[key].expectations.createOrganisationInHorizonRequests.forEach((expectation) =>
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateOrganisationInteraction(expectation)
					)
				);

				//successfully upload contacts
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'APPELLANT_CONTACT_appealThatWillFailAppeal'
				);
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'AGENT_CONTACT_appealThatWillFailAppeal'
				);
				inputs[key].expectations.createContactInHorizonRequests.forEach((expectation) =>
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateContactInteraction(expectation)
					)
				);

				// logger.debug(`Attempting to upload ${key} 3 times`);
				for (let attempts = 1; attempts <= 3; attempts++) {
					await mockedExternalApis.mockHorizonCreateAppealResponse(500);

					// When: we trigger the submission of the appeals to the back-office 3 times
					await appealsApi.put(`/api/v1/back-office/appeals`);

					// And: we query the back-end:
					const backOfficeAppealResponse = await appealsApi.get(
						`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
					);

					if (attempts < 3) {
						expect(backOfficeAppealResponse.status).toBe(202); // ...on the first 2 attempts the appeal will remain in the back office
					} else {
						expect(backOfficeAppealResponse.status).toBe(404); // ...on the 3rd attempt the appeal will no longer be in the back office

						// And: when querying the failed appeals, the appeal will be found
						const failedAppealResponse = await appealsApi.get(
							`/api/v1/for-manual-intervention/appeals/${inputs[key].appeal.id}`
						);
						expect(failedAppealResponse.status).toBe(202);
					}
					// And: we expect that appeal will not have a Horizon case ID
					const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
					expect(appealResponse.body.horizonId).toBeFalsy();

					// And: only 3 create appeals requests to Horizon will have been made
					const expectedCreateCoreAppealDataRequest =
						inputs[key].expectations.createAppealInHorizonRequest;
					expectations.createCoreAppealAndDocumentRequests.push(
						HorizonInteraction.getCreateAppealInteraction(expectedCreateCoreAppealDataRequest)
					);
				}
			}

			expectations.createOrganisationAndContactRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
			expectations.createCoreAppealAndDocumentRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
		});

		it.skip('should move all appeals to submit after 3 attempts to re-submit Documents to the dead-letter queue', async () => {
			// Given: that we are using the direct Horizon integration
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: we create an appeal:
			//		  * 1 that will fail 3 times to uplaod an organisation
			let inputs = {
				appealThatWillFailDocuments: null
			};

			for (const key in inputs) {
				inputs[key] = HorizonIntegrationInputCondition.get({
					description: `Appeal ${key}`,
					appeal: AppealFixtures.newFullAppeal({
						agentAppeal: true,
						agentCompanyName: 'Agent Company Name',
						appellantCompanyName: 'Appellant Company Name'
					}),
					expectedOrganisationNamesInCreateOrganisationRequests: [
						'Appellant Company Name',
						'Agent Company Name'
					],
					expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name',
					expectedContactRequests: [
						{
							firstName: 'Appellant',
							lastName: 'Name',
							email: { '__i:nil': 'true' },
							type: 'Appellant',
							orgId: `APPELLANT_ORG_${key}`
						},
						{
							firstName: 'Agent',
							lastName: 'Name',
							email: 'test@example.com',
							type: 'Agent',
							orgId: `AGENT_ORG_${key}`
						}
					],
					expectedContactIdsInCreateAppealRequest: [
						`APPELLANT_CONTACT_${key}`,
						`AGENT_CONTACT_${key}`
					]
				});
			}

			const expectations = {
				createOrganisationAndContactRequests: [],
				createCoreAppealAndDocumentRequests: []
			};

			// And: these are loaded for submission to the back-office
			for (const key in inputs) {
				const createdAppealResponse = await _createAppeal(inputs[key].appeal);
				const createdAppeal = createdAppealResponse.body;
				await appealsApi.post(`/api/v1/back-office/appeals/${createdAppeal.id}`);
			}

			// And: we expect an email to be sent to the appellant for every appeal
			//      since the "loading for submission" phase of each appeal will be successful.
			for (const key in inputs) {
				expectedNotifyInteractions.push(
					NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
						inputs[key].appeal,
						inputs[key].expectations.emailToAppellant.name,
						inputs[key].lpa.name
					)
				);
			}
			// And: we expect a failure email to be sent once with the initial _id
			for (const key in inputs) {
				const originalBackOfficeAppealResponse = await appealsApi.get(
					`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
				);
				expectedNotifyInteractions.push(
					NotifyInteraction.getFailureToUploadToHorizonEmailInteraction(
						originalBackOfficeAppealResponse.body.appeal.id
					)
				);
			}

			// And: when submitting the appeal it will fail to upload appeal data 3 times:
			for (const key in inputs) {
				//successfully upload Organisations
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'APPELLANT_ORG_appealThatWillFailDocuments'
				);
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'AGENT_ORG_appealThatWillFailDocuments'
				);
				inputs[key].expectations.createOrganisationInHorizonRequests.forEach((expectation) =>
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateOrganisationInteraction(expectation)
					)
				);

				//successfully upload contacts
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'APPELLANT_CONTACT_appealThatWillFailDocuments'
				);
				await mockedExternalApis.mockHorizonCreateContactResponse(
					200,
					'AGENT_CONTACT_appealThatWillFailDocuments'
				);
				inputs[key].expectations.createContactInHorizonRequests.forEach((expectation) =>
					expectations.createOrganisationAndContactRequests.push(
						HorizonInteraction.getCreateContactInteraction(expectation)
					)
				);

				//successfully upload appeal data
				await mockedExternalApis.mockHorizonCreateAppealResponse(
					200,
					'CASE_REF_appealThatWillFailDocuments'
				);
				const expectedCreateCoreAppealDataRequest =
					inputs[key].expectations.createAppealInHorizonRequest;
				expectations.createCoreAppealAndDocumentRequests.push(
					HorizonInteraction.getCreateAppealInteraction(expectedCreateCoreAppealDataRequest)
				);
				const appealDocuments = [
					...jp.query(inputs.appealThatWillFailDocuments.appeal, '$..uploadedFile').flat(Infinity),
					...jp.query(inputs.appealThatWillFailDocuments.appeal, '$..uploadedFiles').flat(Infinity)
				];
				// logger.debug(`Attempting to upload ${key} 3 times`);
				for (let attempts = 1; attempts <= 3; attempts++) {
					for (let documentIndex = 0; documentIndex < appealDocuments.length; documentIndex++) {
						const document = appealDocuments[documentIndex];
						await mockedExternalApis.mockDocumentsApiResponse(
							200,
							inputs[key].appeal.id,
							document,
							true
						); // ...no matter what, the appeal docs can be downloaded for submission to the back-office...
						await mockedExternalApis.mockHorizonUploadDocumentResponse(500, document);
					}

					// When: we trigger the submission of the appeals to the back-office 3 times
					await appealsApi.put(`/api/v1/back-office/appeals`);

					// And: we query the back-end:
					const backOfficeAppealResponse = await appealsApi.get(
						`/api/v1/back-office/appeals/${inputs[key].appeal.id}`
					);

					if (attempts < 3) {
						expect(backOfficeAppealResponse.status).toBe(202); // ...on the first 2 attempts the appeal will remain in the back office
					} else {
						expect(backOfficeAppealResponse.status).toBe(404); // ...on the 3rd attempt the appeal will no longer be in the back office

						// And: when querying the failed appeals, the appeal will be found
						const failedAppealResponse = await appealsApi.get(
							`/api/v1/for-manual-intervention/appeals/${inputs[key].appeal.id}`
						);
						expect(failedAppealResponse.status).toBe(202);
					}
					// And: we expect that appeal will not have a Horizon case ID
					const appealResponse = await appealsApi.get(`/api/v1/appeals/${inputs[key].appeal.id}`);
					expect(appealResponse.body.horizonId).toBeFalsy();

					appealDocuments.forEach((document) => {
						document.name = '&apos;&lt;&gt;test&amp;&quot;pdf.pdf'; // Check that bad characters have been sanitised
						expectations.createCoreAppealAndDocumentRequests.push(
							HorizonInteraction.getCreateDocumentInteraction(
								`CASE_REF_appealThatWillFailDocuments`,
								document,
								true
							)
						);
					});
				}
			}

			expectations.createOrganisationAndContactRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
			expectations.createCoreAppealAndDocumentRequests.forEach((expectation) =>
				expectedHorizonInteractions.push(expectation)
			);
		});
	});
});

describe('Final comments', () => {
	it('Should submit the final comment to the back-end when submitted before the expiry date', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let horizonId = 1345678;

		let finalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId
		});

		// When: it is submitted to the back-end
		let response = await _createFinalComment(finalCommentToSubmit);

		// Then: It should return a status code of 201
		expect(response.status).toBe(201);

		// And: The back-end should contain one appeal for that horizon Id
		let submittedFinalComment = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComment.status).toBe(201);
		expect(submittedFinalComment.body.length).toBe(1);
	});

	it('Should not submit the final comment if a final comment exists with the same horizonId and email', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let horizonId = 1345678;

		let finalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId
		});

		// When: it is submitted to the back-end twice
		let firstResponse = await _createFinalComment(finalCommentToSubmit);
		let secondResponse = await _createFinalComment(finalCommentToSubmit);

		// Then: It should return a status code of 201 for the first
		expect(firstResponse.status).toBe(201);

		// And: Return a status code of 409 for the second
		expect(secondResponse.status).toBe(409);

		// And: The back-end should contain one final comment for that horizon Id
		let submittedFinalComment = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComment.status).toBe(201);
		expect(submittedFinalComment.body.length).toBe(1);
	});

	it('Should not submit the final comment if the expiry date is in the past', async () => {
		// Given: A final comment with an expiry date in the past
		let today = new Date();
		let yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);
		let expiryDate = yesterday.toISOString();
		let horizonId = 1345678;

		let finalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId
		});

		// When: it is submitted to the back end
		let response = await _createFinalComment(finalCommentToSubmit);

		// Then: It should return a status code of 409
		expect(response.status).toBe(409);

		// And: The back-end should not contain an final comment for the horizon Id
		let submittedFinalComment = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComment.status).toBe(404);
	});

	it('Should submit 2 final comments if the final comments have a different horizonId', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let firstHorizonId = 1345678;
		let secondHorizonId = 9999999;

		let firstFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: firstHorizonId
		});

		let secondFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: secondHorizonId
		});

		// When: it is submitted to the back-end twice
		let firstResponse = await _createFinalComment(firstFinalCommentToSubmit);
		let secondResponse = await _createFinalComment(secondFinalCommentToSubmit);

		// Then: It should return a status code of 201 for the both
		expect(firstResponse.status).toBe(201);
		expect(secondResponse.status).toBe(201);

		// And: The back-end should contain one final comment for each horizon Id
		let firstSubmittedFinalComment = await appealsApi.get(
			`/api/v1/final-comments/${firstHorizonId}`
		);
		expect(firstSubmittedFinalComment.status).toBe(201);
		expect(firstSubmittedFinalComment.body.length).toBe(1);

		let secondSubmittedFinalComment = await appealsApi.get(
			`/api/v1/final-comments/${secondHorizonId}`
		);
		expect(secondSubmittedFinalComment.status).toBe(201);
		expect(secondSubmittedFinalComment.body.length).toBe(1);
	});

	it('Should submit 2 final comments if the final comments have the same horizonId but different emails', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let horizonId = 9999999;

		let firstFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId,
			email: 'test@example.com'
		});

		let secondFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId,
			email: 'test2@example.com'
		});

		// When: it is submitted to the back-end twice
		let firstResponse = await _createFinalComment(firstFinalCommentToSubmit);
		let secondResponse = await _createFinalComment(secondFinalCommentToSubmit);

		// Then: It should return a status code of 201 for the both
		expect(firstResponse.status).toBe(201);
		expect(secondResponse.status).toBe(201);

		// And: The back-end should contain two final comments for that horizonId
		let submittedFinalComments = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComments.status).toBe(201);
		expect(submittedFinalComments.body.length).toBe(2);
	});
});

const _createAppeal = async (householderAppeal = AppealFixtures.newHouseholderAppeal()) => {
	const appealCreatedResponse = await appealsApi.post('/api/v1/appeals');
	const appealCreated = appealCreatedResponse.body;

	householderAppeal.id = appealCreated.id;
	const savedAppealResponse = await appealsApi
		.put(`/api/v1/appeals/${appealCreated.id}`)
		.send(householderAppeal);

	return savedAppealResponse;
};

const _createFinalComment = async (finalComment) => {
	return await appealsApi.post('/api/v1/final-comments').send(finalComment);
};

/**
 * Clears out all collection from the database EXCEPT the LPA collection, since this is needed
 * from one test to the next, and its data does not change during any test execution.
 */
const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db('foo').collections();

	const databaseCollectionsFiltered = databaseCollections.filter(
		(collection) => collection.namespace.split('.')[1] !== 'lpa'
	);

	for (const collection of databaseCollectionsFiltered) {
		await collection.drop();
	}
};
