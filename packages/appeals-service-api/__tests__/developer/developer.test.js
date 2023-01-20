const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const container = require('rhea');
const crypto = require('crypto');
const jp = require('jsonpath');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const { TestMessageQueue } = require('./external-dependencies/message-queue/test-message-queue');
const { MockedExternalApis } = require('./external-dependencies/rest-apis/mocked-external-apis');
const { Interaction } = require('./external-dependencies/rest-apis/interactions/interaction');
const { JsonPathExpression } = require('./external-dependencies/rest-apis/json-path-expression');
const {
	HorizonInteraction
} = require('./external-dependencies/rest-apis/interactions/horizon-interaction');
const { NotifyInteraction } = require('./external-dependencies/rest-apis/interactions/notify-interaction');
const AppealFixtures = require('./fixtures/appeals');
const HorizonIntegrationInputCondition = require('./utils/horizon-integration-input-condition');

const waitFor = require('./utils/waitFor');
const { isFeatureActive } = require('../../src/configuration/featureFlag');

let appealsApi;
let databaseConnection;
let messageQueue;
let messages = [];
let expectedMessages;
let mockedExternalApis;
let expectedHorizonInteractions;
let expectedNotifyInteractions;
let testLpaEmail = 'appealplanningdecisiontest@planninginspectorate.gov.uk';
let testLpaCodeEngland = 'E69999999';
let testLpaCodeWales = 'W69999999';
let testLpaNameEngland = 'System Test Borough Council England';
let testLpaNameWales = 'System Test Borough Council Wales';
let testHorizonLpaCodeWales = 'H1234';

const appealFixtures = new AppealFixtures();
const horizonIntegrationInputCondition = new HorizonIntegrationInputCondition();

jest.setTimeout(30000);
jest.mock('../../src/db/db');
jest.mock('../../src/configuration/featureFlag');

beforeAll(async () => {
	///////////////////////////////
	///// SETUP EXTERNAL APIs /////
	///////////////////////////////

	mockedExternalApis = await MockedExternalApis.setup();

	////////////////////////////
	///// SETUP TEST QUEUE /////
	////////////////////////////

	messageQueue = await TestMessageQueue.create();
	const test_listener = container.create_container();

	test_listener
		.connect(messageQueue.getTestConfigurationSettingsJSON().connection)
		.open_receiver(messageQueue.getTestConfigurationSettingsJSON().queue);

	test_listener.on('message', (context) => {
		const output = context.message.body.content;
		messages.push(JSON.parse(output.toString()));
	});

	test_listener.on('disconnected', (context) => {
		context.connection.close();
	});

	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let mockedDatabase = await databaseConnection.db('foo');
	appDbConnection.get.mockReturnValue(mockedDatabase);

	/////////////////////////////
	///// SETUP TEST CONFIG /////
	/////////////////////////////

	appConfiguration.messageQueue.horizonHASPublisher =
		messageQueue.getTestConfigurationSettingsJSON();
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

	// THE LINE BELOW IS CRUCIAL: without it, you can get a race condition where a message is produced by the API,
	// but isn't read in time for the test to make a solid assertion, i.e. you can get false negatives without this.
	await waitFor(() => messages.length === expectedMessages.length);
	for (const index in expectedMessages) {
		expect(messages[index]).toMatchObject(expectedMessages[index]);
	}
	messages = [];
});

afterAll(async () => {
	await databaseConnection.close();
	await messageQueue.teardown();
	await mockedExternalApis.teardown();
});

describe('Appeals', () => {
	it(`should return an error if we try to update an appeal that doesn't exist`, async () => {
		// When: an appeal is sent via a PUT or PATCH request, but hasn't yet been created
		const householderAppeal = appealFixtures.newHouseholderAppeal(uuid.v4());
		const putResponse = await appealsApi
			.put(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		const patchResponse = await appealsApi
			.patch(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		// Then: we should get a 404 status code for both requests
		expect(putResponse.status).toBe(404);
		expect(patchResponse.status).toBe(404);

		// And: there should be no data on the message queue
		expectedMessages = [];

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

		// And: there should be no data on the message queue
		expectedMessages = [];

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

		// And: there should be no data on the message queue
		expectedMessages = [];

		// And: external systems should be interacted with in the following ways
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});

	it(`should return an error if an appeal is requested that doesn't exist`, async () => {
		// When: we try to access a non-existent appeal
		const getAppealResponse = await appealsApi.get(`/api/v1/appeals/${uuid.v4()}`);

		// Then: we should get a 404 status
		expect(getAppealResponse.status).toEqual(404);

		// And: there should be no data on the message queue
		expectedMessages = [];

		// And: external systems should be interacted with in the following ways
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});
});

describe('Back Office', () => {
	describe('submit appeals', () => {
		const householderAppealConditions = [
			// NOTE: for householder appeals, neither an agent or appellant can add their company name (if they belong to one).
			//       Therefore, there are no tests here to check for system behaviour with such inputs.
			horizonIntegrationInputCondition.get(),
			horizonIntegrationInputCondition.get({
				description: 'no Horizon ID field',
				setHorizonIdFunction: (appeal) => {
					delete appeal.horizonId;
				}
			}),
			horizonIntegrationInputCondition.get({
				description: 'a Welsh LPA',
				lpaCode: testLpaCodeWales,
				horizonLpaCode: testHorizonLpaCodeWales
			}),
			horizonIntegrationInputCondition.get({
				description: 'a householder appeal where the appellant owns the whole site',
				appeal: appealFixtures.newHouseholderAppeal({ ownsSite: true })
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a householder appeal where there is an agent appealling on behalf of an appellent',
				appeal: appealFixtures.newHouseholderAppeal({ agentAppeal: true }),
				expectedContactRequests: [
					{
						email: { '__i:nil': 'true' },
						firstName: 'Appellant',
						lastName: 'Name',
						type: 'Appellant',
						orgId: null
					},
					{
						email: 'test@pins.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: null
					}
				],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a refused householder appeal with a "householder" planning application',
				appeal: appealFixtures.newHouseholderAppeal({
					decision: 'refused',
					planningApplicationType: 'householder-planning'
				}),
				expectedCaseworkReason: '1. Refused planning permission for the development'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a refused householder appeal with a "removal or variation of conditions" planning application',
				appeal: appealFixtures.newHouseholderAppeal({
					decision: 'refused',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason: '2. Refused permission to vary or remove a condition(s)'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a refused householder appeal with a "prior approval" planning application',
				appeal: appealFixtures.newHouseholderAppeal({
					decision: 'refused',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason: '3. Refused prior approval of permitted development rights'
			})
		];

		const fullAppealConditions = [
			horizonIntegrationInputCondition.get({
				description: 'a full appeal where the appellant owns all the land',
				appeal: appealFixtures.newFullAppeal({ ownsAllTheLand: true })
			}),
			horizonIntegrationInputCondition.get({
				description: 'a full appeal where the appellant is not an agent, and does have a company',
				appeal: appealFixtures.newFullAppeal({ appellantCompanyName: 'Appellant Company Name' }),
				expectedContactRequests: [
					{
						firstName: 'Appellant',
						lastName: 'Name',
						email: 'test@pins.com',
						type: 'Appellant',
						orgId: 'O_0'
					}
				],
				expectedOrganisationNamesInCreateOrganisationRequests: ['Appellant Company Name']
			}),
			horizonIntegrationInputCondition.get({
				description: 'a full appeal where there is an agent appealling on behalf of an appellent',
				appeal: appealFixtures.newFullAppeal({ agentAppeal: true }),
				expectedContactRequests: [
					{
						email: { '__i:nil': 'true' },
						firstName: 'Appellant',
						lastName: 'Name',
						type: 'Appellant',
						orgId: null
					},
					{
						email: 'test@pins.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: null
					}
				],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a full appeal where the appellant is an agent, and the agent belongs to a company, but the original appellant does not',
				appeal: appealFixtures.newFullAppeal({
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
						email: 'test@pins.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: `O_0`
					}
				],
				expectedOrganisationNamesInCreateOrganisationRequests: ['Agent Company Name'],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a full appeal where the appellant is an agent, and the agent does not belong to a company, but the original appellant does',
				appeal: appealFixtures.newFullAppeal({
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
						email: 'test@pins.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: null
					}
				],
				expectedOrganisationNamesInCreateOrganisationRequests: ['Appellant Company Name'],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a full appeal where the appellant is an agent, and the agent/original appellant belong to companies',
				appeal: appealFixtures.newFullAppeal({
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
						email: 'test@pins.com',
						firstName: 'Agent',
						lastName: 'Name',
						type: 'Agent',
						orgId: `O_1`
					}
				],
				expectedOrganisationNamesInCreateOrganisationRequests: [
					'Appellant Company Name',
					'Agent Company Name'
				],
				expectedNameOnAppealSuccessfullySubmittedEmail: 'Agent Name'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a refused full appeal with a "full planning" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'full-appeal'
				}),
				expectedCaseworkReason: '1. Refused planning permission for the development'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a refused full appeal with a "removal or variation of conditions" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason: '2. Refused permission to vary or remove a condition(s)'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a refused full appeal with a "prior approval" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason: '3. Refused prior approval of permitted development rights'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "householder planning" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'householder-planning'
				}),
				expectedCaseworkReason:
					'4. Granted planning permission for the development subject to conditions to which you object'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "full appeal" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'full-appeal'
				}),
				expectedCaseworkReason:
					'4. Granted planning permission for the development subject to conditions to which you object'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "prior approval" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason:
					'4. Granted planning permission for the development subject to conditions to which you object'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a refused full appeal with an "outline planning" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'outline-planning'
				}),
				expectedCaseworkReason:
					'5. Refused approval of the matters reserved under an outline planning permission'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a refused full appeal with a "reserved matters" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'refused',
					planningApplicationType: 'reserved-matters'
				}),
				expectedCaseworkReason:
					'5. Refused approval of the matters reserved under an outline planning permission'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a granted full appeal with an "outline planning" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'outline-planning'
				}),
				expectedCaseworkReason:
					'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a granted full appeal with a "reserved matters" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'reserved-matters'
				}),
				expectedCaseworkReason:
					'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a granted full appeal with a "removal or variation of conditions" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'granted',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason:
					'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "householder planning" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'householder-planning'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			horizonIntegrationInputCondition.get({
				description: 'a no decision received full appeal with a "full appeal" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'full-appeal'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with an "outline planning" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'outline-planning'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "prior approval" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'prior-approval'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "reserved-matters" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'reserved-matters'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			}),
			horizonIntegrationInputCondition.get({
				description:
					'a no decision received full appeal with a "removal-or-variation-of-conditions" planning application',
				appeal: appealFixtures.newFullAppeal({
					decision: 'nodecisionreceived',
					planningApplicationType: 'removal-or-variation-of-conditions'
				}),
				expectedCaseworkReason:
					'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
			})
		];

		it.each([
			...householderAppealConditions,
			...fullAppealConditions
		])(
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
				].forEach(async document => {
					await mockedExternalApis.mockDocumentsApiResponse(200, createdAppeal.id, document, true);
					await mockedExternalApis.mockHorizonUploadDocumentResponse(200, document);
				})

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

				// And: the status code for the retrieval request should be 200
				expect(retrievedAppealResponse.status).toBe(200);

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
				].map(document => {
					document.name = '&apos;&lt;&gt;test&amp;&quot;pdf.pdf' // Check that bad characters have been sanitised
					return HorizonInteraction.getCreateDocumentInteraction(mockedCaseReference.slice(-7), document, true)
				});

				expectedHorizonInteractions = [
					...createOrganisationInteractions,
					...createContactInteractions,
					createAppealInteraction,
					...createDocumentInteractions
				];

				// And: Notify has been interacted with as expected
				const emailToAppellantInteraction = NotifyInteraction.getAppealSubmittedEmailForAppellantInteraction(
					condition.appeal,
					condition.expectations.emailToAppellant.name,
					condition.lpa.name
				);

				const emailToLpaInteraction = NotifyInteraction.getAppealSubmittedEmailForLpaInteraction(
					condition.appeal,
					condition.lpa.name,
					condition.lpa.email
				);

				expectedNotifyInteractions = [emailToAppellantInteraction, emailToLpaInteraction];

				// And: there are no messages on the message queue
				expectedMessages = [];
			}
		);

		// TODO: Due to recent changes, the server will no longer return errors in the following circumstances.
		// these tests will be updated as part of https://pins-ds.atlassian.net.mcas.ms/browse/AS-5698
		it.skip('should return a 504 if an appeal is submitted to Horizon but Horizon does not respond with a 200 when creating organisations', async () => {
			// Given: that we have a condition whereby to create an appeal in Horizon, a create organisation request should be made
			const condition = horizonIntegrationInputCondition.get({
				appeal: appealFixtures.newFullAppeal({ appellantCompanyName: 'Appellant Company Name' }),
				expectedContactRequests: [
					{
						firstName: 'Appellant',
						lastName: 'Name',
						email: 'test@pins.com',
						type: 'Appellant',
						orgId: 'O_0'
					}
				],
				expectedOrganisationNamesInCreateOrganisationRequests: ['Appellant Company Name']
			});

			// And: this appeal is not known to the back office
			condition.setHorizonId(condition.appeal);
			condition.appeal.lpaCode = condition.lpa.code;
			const createAppealResponse = await _createAppeal(condition.appeal);
			let createdAppeal = createAppealResponse.body;

			// And: we use the Horizon integration back office strategy
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: Horizon's create organisation endpoint is mocked to return a 500
			for (let i in condition.expectations.createOrganisationInHorizonRequests) {
				const mockedOrganisationId = `O_${i}`;
				await mockedExternalApis.mockHorizonCreateContactResponse(500, mockedOrganisationId);
			}

			// When: we submit the appeal to the back office
			const submittedToBackOfficeResponse = await appealsApi.put(
				`/api/v1/back-office/appeals/${createdAppeal.id}`
			);

			// And: the appeal is then retrieved from the appeals API
			const retrievedAppealResponse = await appealsApi.get(`/api/v1/appeals/${createdAppeal.id}`);

			// Then: we expect a 504 status code in the response
			expect(submittedToBackOfficeResponse.status).toEqual(504);

			// And: the status code for the retrieval request should be 200
			expect(retrievedAppealResponse.status).toBe(200);

			// And: the appeal should not have been updated
			expect(retrievedAppealResponse.body).toMatchObject(createdAppeal);

			// And: we expect Horizon to have been interacted with as expected
			const createOrganisationInteractions =
				condition.expectations.createOrganisationInHorizonRequests.map((expectation) =>
					HorizonInteraction.getCreateOrganisationInteraction(expectation)
				);
			expectedHorizonInteractions = [...createOrganisationInteractions];

			// And: we expect Notify to have been interacted with as expected
			expectedNotifyInteractions = [];

			// And: we expect the message queue to have been interacted with as expected
			expectedMessages = [];
		});

		it.skip('should return a 504 if an appeal is submitted to Horizon but Horizon does not respond with a 200 when creating contacts', async () => {
			// Given: that we have a condition whereby to create an appeal in Horizon, no create organisation request should be made
			const condition = horizonIntegrationInputCondition.get({
				appeal: appealFixtures.newFullAppeal()
			});

			// And: this appeal is not known to the back office
			condition.setHorizonId(condition.appeal);
			condition.appeal.lpaCode = condition.lpa.code;
			const createAppealResponse = await _createAppeal(condition.appeal);
			let createdAppeal = createAppealResponse.body;

			// And: we use the Horizon integration back office strategy
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: Horizon's create contact endpoint is mocked to return a 500
			for (let i in condition.expectations.createContactInHorizonRequests) {
				const mockedContactId = `P_${i}`;
				await mockedExternalApis.mockHorizonCreateContactResponse(500, mockedContactId);
			}

			// When: we submit the appeal to the back office
			const submittedToBackOfficeResponse = await appealsApi.put(
				`/api/v1/back-office/appeals/${createdAppeal.id}`
			);

			// And: the appeal is then retrieved from the appeals API
			const retrievedAppealResponse = await appealsApi.get(`/api/v1/appeals/${createdAppeal.id}`);

			// Then: we expect a 504 status code in the response
			expect(submittedToBackOfficeResponse.status).toEqual(504);

			// And: the status code for the retrieval request should be 200
			expect(retrievedAppealResponse.status).toBe(200);

			// And: the appeal should not have been updated
			expect(retrievedAppealResponse.body).toMatchObject(createdAppeal);

			// And: we expect Horizon to have been interacted with
			const createOrganisationInteractions =
				condition.expectations.createOrganisationInHorizonRequests.map((expectation) =>
					HorizonInteraction.getCreateOrganisationInteraction(expectation)
				);
			const createContactInteractions = condition.expectations.createContactInHorizonRequests.map(
				(expectation) => HorizonInteraction.getCreateContactInteraction(expectation)
			);
			expectedHorizonInteractions = [
				...createOrganisationInteractions,
				...createContactInteractions
			];

			// And: we expect Notify to have been interacted with as expected
			expectedNotifyInteractions = [];

			// And: we expect the message queue to have been interacted with as expected
			expectedMessages = [];
		});

		it.skip('should return a 504 if an appeal is submitted to Horizon but Horizon does not respond with a 200 when creating the appeal', async () => {
			// Given: that we have a condition whereby to create an appeal in Horizon, no create organisation request should be made
			const condition = horizonIntegrationInputCondition.get({
				appeal: appealFixtures.newFullAppeal()
			});

			// And: this appeal is not known to the back office
			condition.setHorizonId(condition.appeal);
			condition.appeal.lpaCode = condition.lpa.code;
			const createAppealResponse = await _createAppeal(condition.appeal);
			let createdAppeal = createAppealResponse.body;

			// And: we use the Horizon integration back office strategy
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: Horizon's create contact endpoint is mocked to return a 200
			for (let i in condition.expectations.createContactInHorizonRequests) {
				const mockedContactId = `P_${i}`;
				await mockedExternalApis.mockHorizonCreateContactResponse(200, mockedContactId);
			}

			// And: Horizon's create appeal endpoint is mocked to return a 500
			const mockedCaseReference = 'APP/Z0116/D/20/3218465';
			await mockedExternalApis.mockHorizonCreateAppealResponse(500, mockedCaseReference);

			// When: we submit the appeal to the back office
			const submittedToBackOfficeResponse = await appealsApi.put(
				`/api/v1/back-office/appeals/${createdAppeal.id}`
			);

			// And: the appeal is then retrieved from the appeals API
			const retrievedAppealResponse = await appealsApi.get(`/api/v1/appeals/${createdAppeal.id}`);

			// Then: we expect a 504 status code in the response
			expect(submittedToBackOfficeResponse.status).toEqual(504);

			// And: the status code for the retrieval request should be 200
			expect(retrievedAppealResponse.status).toBe(200);

			// And: the appeal should not have been updated
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

			expectedHorizonInteractions = [
				...createOrganisationInteractions,
				...createContactInteractions,
				createAppealInteraction
			];

			// And: we expect Notify to have been interacted with as expected
			expectedNotifyInteractions = [];

			// And: we expect the message queue to have been interacted with as expected
			expectedMessages = [];
		});

		it.skip('should not submit an appeal to the back office if the appeal specified does not exist', async () => {
			// When: an unknown appeal is submitted to the back office
			const submittedAppealResponse = await appealsApi.put(`/api/v1/back-office/appeals/NOT_KNOWN`);

			// Then: the status code should be 404
			expect(submittedAppealResponse.status).toBe(404);

			// And: Horizon should not be interacted with
			expectedHorizonInteractions = [];

			// And: Notify should not be interacted with
			expectedNotifyInteractions = [];

			// And: the message queue should not be interacted with
			expectedMessages = [];
		});

		it.skip('should not submit an appeal to the back office, if the appeal is known and has a Horizon ID', async () => {
			// Given: an appeal is created and known to the back office
			const householderAppeal = appealFixtures.newHouseholderAppeal();
			householderAppeal.horizonId = 'itisknown';
			const savedAppealResponse = await _createAppeal();
			let savedAppeal = savedAppealResponse.body;

			// When: an unknown appeal is submitted to the back office
			const submittedAppealResponse = await appealsApi.put(
				`/api/v1/back-office/appeals/${savedAppeal.id}`
			);

			// Then: the status code should be 409
			expect(submittedAppealResponse.status).toBe(409);

			// And: Horizon should not be interacted with
			expectedHorizonInteractions = [];

			// And: Notify should not be interacted with
			expectedNotifyInteractions = [];

			// And: the message queue should not be interacted with
			expectedMessages = [];
		});
	});

	// describe('failed submissions', () => {

	// 	it('should resubmit documents that failed to be uploaded to the back-office, from a set of appeals whose documents failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', async () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });

			// And: we have three appeals that have agent and appellant contacts that are saved to the API but are
			//      unknown to the back-office saved on the server. Every appeal's contacts have organisation names
			//      and their documents are known to the appeals API.
			let inputs = [];
			for (let i=0; i < 3; i++) {
				const appeal = appealFixtures.newFullAppeal({ agentAppeal: true, agentCompanyName: 'Agent Company Name', appellantCompanyName: 'Appellant Company Name'});
				const createAppealResponse = await _createAppeal(appeal);
				const createdAppeal = createAppealResponse.body;
	// 		// And: we have three appeals that have agent and appellant contacts that are saved to the API but are
	// 		//      unknown to the back-office saved on the server. Every appeal's contacts have organisation names
	// 		//      and their documents are known to the appeals API.
	// 		let inputs = [];
	// 		let horizonDocumentInteractions;
	// 		let horizonContactInteractions;
	// 		let horizonAppealInteractions;

			// for (let i=0; i < 3; i++) {
			// 	const appeal = appealFixtures.newFullAppeal({ agentAppeal: true, agentCompanyName: 'Agent Company Name', appellantCompanyName: 'Appellant Company Name'});
			// 	const createAppealResponse = await _createAppeal(appeal);
			// 	const createdAppeal = createAppealResponse.body;

			// 	await mockedExternalApis.mockHorizonCreateContactResponse(200, `APPELLANT_ORG_${i}_0`);
			// 	await mockedExternalApis.mockHorizonCreateContactResponse(200, `AGENT_ORG_${i}_1`);
			// 	await mockedExternalApis.mockHorizonCreateContactResponse(200, `APPELLANT_CONTACT_${i}_0`);
			// 	await mockedExternalApis.mockHorizonCreateContactResponse(200, `AGENT_CONTACT_${i}_0`);
			// 	await mockedExternalApis.mockHorizonCreateAppealResponse(200, `CASE_REF_${i}234567`)
	// 		for (let i=0; i < 3; i++) {
	// 			const appeal = appealFixtures.newFullAppeal({ agentAppeal: true, agentCompanyName: 'Agent Company Name', appellantCompanyName: 'Appellant Company Name'});
	// 			const createAppealResponse = await _createAppeal(appeal);
	// 			const createdAppeal = createAppealResponse.body;

	// 			const documents = [
	// 				...jp.query(appeal, '$..uploadedFile').flat(Infinity),
	// 				...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	// 			];
	// 			await mockedExternalApis.mockHorizonCreateContactResponse(200, `APPELLANT_ORG_${i}_0`);
	// 			await mockedExternalApis.mockHorizonCreateContactResponse(200, `AGENT_ORG_${i}_1`);
	// 			await mockedExternalApis.mockHorizonCreateContactResponse(200, `APPELLANT_CONTACT_${i}_0`);
	// 			await mockedExternalApis.mockHorizonCreateContactResponse(200, `AGENT_CONTACT_${i}_0`);
	// 			await mockedExternalApis.mockHorizonCreateAppealResponse(200, `CASE_REF_${i}234567`)

	// 			documents.forEach(async (document) => {
	// 				await mockedExternalApis.mockDocumentsApiResponse(200, createdAppeal.id, document, true);
	// 			});
	// 			const documents = [
	// 				...jp.query(appeal, '$..uploadedFile').flat(Infinity),
	// 				...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	// 			];

	// 			// And: all the documents on the first appeal will be successfully uploaded to the back-office
	// 			if (i == 0) {
	// 				documents.forEach(async (document) => {
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(200, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 			// And: the even numbered documents of the second appeal will error-out when they are being processed by the back-office
	// 			else if (i == 1) {
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 500 : 200;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 			// And: the odd numbered documents of the third appeal will error-out when they are being processed by the back-office
	// 			else {
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 200 : 500;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 			documents.forEach(async (document) => {
	// 				await mockedExternalApis.mockDocumentsApiResponse(200, createdAppeal.id, document, true);
	// 			});

	// 			// And: the documents that failed to send for the second appeal will again fail on re-submission to the back-office
	// 			if(i == 1){
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 500 : 200;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 			// And: all the documents on the first appeal will be successfully uploaded to the back-office
	// 			if (i == 0) {
	// 				documents.forEach(async (document) => {
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(200, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 			// And: the even numbered documents of the second appeal will error-out when they are being processed by the back-office
	// 			else if (i == 1) {
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 500 : 200;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 			// And: the odd numbered documents of the third appeal will error-out when they are being processed by the back-office
	// 			else {
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 200 : 500;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}

	// 			// And: the documents that failed to send for the second appeal will again fail on re-submission to the back-office
	// 			if(i == 1){
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 500 : 200;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}

	// 			inputs.push(createdAppeal);
	// 			console.log(`Inputs are as follows: ${JSON.stringify(inputs)}`);
	// 		}

	// 		// And: we submit all three appeals to the back-office
	// 		inputs.forEach(async appeal => await appealsApi.put(`/api/v1/back-office/appeals/${appeal.id}`));
	// 			inputs.push(createdAppeal);
	// 			console.log(`Inputs are as follows: ${JSON.stringify(inputs)}`);
	// 		}

	// 		// And: the documents that failed to send for the second appeal will again fail on re-submission to the back-office,
	// 		//      but the third appeal's documents will succeed.
	// 		inputs.shift();
	// 		inputs.forEach(async (appeal, appealIndex) => {
	// 			const documents = [
	// 				...jp.query(appeal, '$..uploadedFile').flat(Infinity),
	// 				...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	// 			];
	// 			documents.forEach(async (document) => {
	// 				await mockedExternalApis.mockDocumentsApiResponse(200, appeal.id, document, true);
	// 			});
	// 		// And: we submit all three appeals to the back-office
	// 		inputs.forEach(async appeal => await appealsApi.put(`/api/v1/back-office/appeals/${appeal.id}`));

	// 			if (appealIndex == 0) {
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 500 : 200;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			} else {
	// 				documents.forEach(async (document) => {
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(200, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 		});
	// 		// And: the documents that failed to send for the second appeal will again fail on re-submission to the back-office,
	// 		//      but the third appeal's documents will succeed.
	// 		inputs.shift();
	// 		inputs.forEach(async (appeal, appealIndex) => {
	// 			const documents = [
	// 				...jp.query(appeal, '$..uploadedFile').flat(Infinity),
	// 				...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	// 			];
	// 			documents.forEach(async (document) => {
	// 				await mockedExternalApis.mockDocumentsApiResponse(200, appeal.id, document, true);
	// 			});

	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		const response = await appealsApi.put(`/api/v1/back-office/appeals/failed`);
	// 			if (appealIndex == 0) {
	// 				documents.forEach(async (document, index) => {
	// 					let statusCode = index % 2 == 0 ? 500 : 200;
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(statusCode, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			} else {
	// 				documents.forEach(async (document) => {
	// 					await mockedExternalApis.mockHorizonUploadDocumentResponse(200, document);
	// 					horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 				});
	// 			}
	// 		});

	// 		// Then: we expect a 200 in the response
	// 		expect(response.status).toBe(200);
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		const response = await appealsApi.put(`/api/v1/back-office/appeals/failed`);

	// 		inputs.forEach(async (appeal, appealIndex) => {
	// 			const documents = [
	// 				...jp.query(appeal, '$..uploadedFile').flat(Infinity),
	// 				...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	// 			];
	// 			// And: requests should be sent to the back office to process the even numbered documents of the second appeal, without with its organisation, contacts, appeals
	// 			if(appealIndex == 1){
	// 				documents.forEach(async (document, index) => {
	// 					if(index % 2 == 0){
	// 						horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 					}
	// 				})
	// 			}
	// 			// And: requests should be sent to the back office to process the odd numbered documents of the third appeal, without with its organisation, contacts, appeals
	// 			if(appealIndex == 2){
	// 				documents.forEach(async (document, index) => {
	// 					if(index % 2 !== 0){
	// 						horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 					}
	// 				})
	// 			}
	// 		});
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		expectedNotifyInteractions = [];
	// 		expectedHorizonInteractions = [horizonDocumentInteractions];
	// 		// And: There should be no messages sent to the message queue
	// 		expectedMessages = [];
	// 	});
	// 		// Then: we expect a 200 in the response
	// 		expect(response.status).toBe(200);

	// 	it('should resubmit the appeal, then its documents, from a set of appeals whose appeal data failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });
	// 		inputs.forEach(async (appeal, appealIndex) => {
	// 			const documents = [
	// 				...jp.query(appeal, '$..uploadedFile').flat(Infinity),
	// 				...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	// 			];
	// 			// And: requests should be sent to the back office to process the even numbered documents of the second appeal, without with its organisation, contacts, appeals
	// 			if(appealIndex == 1){
	// 				documents.forEach(async (document, index) => {
	// 					if(index % 2 == 0){
	// 						horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 					}
	// 				})
	// 			}
	// 			// And: requests should be sent to the back office to process the odd numbered documents of the third appeal, without with its organisation, contacts, appeals
	// 			if(appealIndex == 2){
	// 				documents.forEach(async (document, index) => {
	// 					if(index % 2 !== 0){
	// 						horizonDocumentInteractions.push(HorizonInteraction.getCreateDocumentInteraction(appeal.horizonId, document, true));
	// 					}
	// 				})
	// 			}
	// 		});
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		expectedNotifyInteractions = [];
	// 		expectedHorizonInteractions = [horizonDocumentInteractions];
	// 		// And: There should be no messages sent to the message queue
	// 		expectedMessages = [];
	// 	});

	// 		// And: we have three appeals that have agent and appellant contacts, and all contacts have organisation names, that are unknown to the back-office saved on the server
	// 		// And: the last two appeals will error-out when their appeal data is being processed by the back-office
	// 		// And: we submit all three appeals to the back-office
	// 		// And: the first unsuccessful appeal will again fail on re-submission to the back-office
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		// Then: we expect a 200 in the response
	// 		// And: requests should be sent to the back office to process the appeals, and documents for the two appeals whose organisation contact details errored-out
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		// And: There should be no messages sent to the message queue
	// 	});
	// 	it('should resubmit the appeal, then its documents, from a set of appeals whose appeal data failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });

	// 	it('should resubmit the appeal, then its documents, from a set of appeals whose appeal data failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });
	// 		// And: we have three appeals that have agent and appellant contacts, and all contacts have organisation names, that are unknown to the back-office saved on the server
	// 		// And: the last two appeals will error-out when their appeal data is being processed by the back-office
	// 		// And: we submit all three appeals to the back-office
	// 		// And: the first unsuccessful appeal will again fail on re-submission to the back-office
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		// Then: we expect a 200 in the response
	// 		// And: requests should be sent to the back office to process the appeals, and documents for the two appeals whose organisation contact details errored-out
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		// And: There should be no messages sent to the message queue
	// 	});

	// 		// And: we have three appeals that have agent and appellant contacts, and all contacts have organisation names, that are unknown to the back-office saved on the server
	// 		// And: the last two appeals will error-out when their appeal data is being processed by the back-office
	// 		// And: we submit all three appeals to the back-office
	// 		// And: the first unsuccessful appeal will again fail on re-submission to the back-office
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		// Then: we expect a 200 in the response
	// 		// And: requests should be sent to the back office to process the appeals, and documents for the two appeals whose organisation contact details errored-out
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		// And: There should be no messages sent to the message queue
	// 	});
	// 	it('should resubmit the appeal, then its documents, from a set of appeals whose appeal data failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });

	// 	it('should resubmit contacts, then the appeal, then its documents, from a set of appeals whose contacts failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });
	// 		// And: we have three appeals that have agent and appellant contacts, and all contacts have organisation names, that are unknown to the back-office saved on the server
	// 		// And: the last two appeals will error-out when their appeal data is being processed by the back-office
	// 		// And: we submit all three appeals to the back-office
	// 		// And: the first unsuccessful appeal will again fail on re-submission to the back-office
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		// Then: we expect a 200 in the response
	// 		// And: requests should be sent to the back office to process the appeals, and documents for the two appeals whose organisation contact details errored-out
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		// And: There should be no messages sent to the message queue
	// 	});

	// 		// And: we have three appeals that have agent and appellant contacts, and all contacts have organisation names, that are unknown to the back-office saved on the server
	// 		// And: both contacts of the second appeal will error-out when its contacts are being processed by the back-office
	// 		// And: the second contact of the third appeal will error-out when its contacts are being processed by the back-office
	// 		// And: we submit all three appeals to the back-office
	// 		// And: the first unsuccessful appeal will again fail on re-submission to the back-office
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		// Then: we expect a 200 in the response
	// 		// And: requests should be sent to the back office to process both contacts of the second appeal, along with its contacts, appeals, and documents
	// 		// And: requests should be sent to the back office to process the second contact of the third appeal, along with its contacts, appeals, and documents
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		// And: There should be no messages sent to the message queue
	// 	});
	// 	it('should resubmit contacts, then the appeal, then its documents, from a set of appeals whose contacts failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });

	// 	it('should resubmit organisations, then contacts, then the appeal, then its documents, from a set of appeals whose organisations failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });
	// 		// And: we have three appeals that have agent and appellant contacts, and all contacts have organisation names, that are unknown to the back-office saved on the server
	// 		// And: both contacts of the second appeal will error-out when its contacts are being processed by the back-office
	// 		// And: the second contact of the third appeal will error-out when its contacts are being processed by the back-office
	// 		// And: we submit all three appeals to the back-office
	// 		// And: the first unsuccessful appeal will again fail on re-submission to the back-office
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		// Then: we expect a 200 in the response
	// 		// And: requests should be sent to the back office to process both contacts of the second appeal, along with its contacts, appeals, and documents
	// 		// And: requests should be sent to the back office to process the second contact of the third appeal, along with its contacts, appeals, and documents
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		// And: There should be no messages sent to the message queue
	// 	});

	// 	it('should resubmit organisations, then contacts, then the appeal, then its documents, from a set of appeals whose organisations failed to be submitted to the back-office, when the `back-office/appeals/failed` endpoint is called', () => {
	// 		// Given: that we are using the direct Horizon integration
	// 		isFeatureActive.mockImplementation(() => { return true; });

	// 		// And: we have three appeals that have agent and appellant contacts, and all contacts have organisation names, that are unknown to the back-office saved on the server
	// 		// And: both organisations of the second appeal will error-out when its organisations are being processed by the back-office
	// 		// And: the second organisation of the third appeal will error-out when its organisations are being processed by the back-office
	// 		// And: we submit all three appeals to the back-office
	// 		// And: the last unsuccessful appeal will again fail on re-submission to the back-office
	// 		// When: we call the `back-office/appeals/failed` endpoint
	// 		// Then: we expect a 200 in the response
	// 		// And: requests should be sent to the back office to process both organisations of the second appeal, along with its contacts, appeals, and documents
	// 		// And: requests should be sent to the back office to process the second organisation of the third appeal, along with its contacts, appeals, and documents
	// 		// And: Notify should have been called 3 times for each document submission, but also once to notify engineers about what appeals are being reprocessed, and which ones failed/succeeded reprocessing
	// 		// And: There should be no messages sent to the message queue
	// 	});
	// });
});

describe('Final comments', () => {
	it('should return a final comment entity and email the secure code for it to the appellant when requested, after creating the entity', async () => {
		// Given: a request to create a final comments entry for a case
		const caseReference = uuid.v4();
		const appellantEmail = 'foo@bar.com';

		// And: the final comments end date is set in the future
		await mockedExternalApis.mockHorizonGetCaseResponse(new Date(2100, 12, 31, 0, 0, 0), 200);

		// And: setup a mocked response for Notify
		await mockedExternalApis.mockNotifyResponse({}, 200);

		// When: we issue the create final comment request
		const createFinalCommentResponse = await _createFinalComment(caseReference, appellantEmail);

		// And: we try to get a secure code for it afterwards
		const getSecureCodeResponse = await appealsApi.get(
			`/api/v1/final_comments/${caseReference}/secure_code`
		);

		// And: we encrypt the secure code and send it to `/final_comments/{case_reference}
		const notifyRequests = await mockedExternalApis.getRecordedRequestsForNotify();
		const secureCode = notifyRequests[0].body.json.personalisation['unique code'].toString();
		const getFinalCommentsResponse = await appealsApi
			.get(`/api/v1/final_comments/${caseReference}`)
			.set('secure_code', _encryptValue(secureCode));

		// Then: we should get 204 in the create final comment response
		expect(createFinalCommentResponse.status).toBe(204);

		// And: we should get 200 in the get secure code response
		expect(getSecureCodeResponse.status).toBe(200);

		// And: we should get 200 in the final comments response
		expect(getFinalCommentsResponse.status).toBe(200);

		// And: there should be no data on the message queue
		expectedMessages = [];

		// And: external systems should be interacted with in the following ways
		const expectedGetCaseRefInteraction = new Interaction()
			.setNumberOfKeysExpectedInJson(4)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__soap_op'),
				'http://tempuri.org/IHorizon/GetCase'
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__xmlns'),
				'http://tempuri.org/'
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.GetCase.caseReference'), caseReference);

		const expectedSecureCodeEmailSentToAppellantInteraction = new Interaction()
			.setNumberOfKeysExpectedInJson(5)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.template_id'),
				appConfiguration.services.notify.templates.SAVE_AND_RETURN
					.enterCodeIntoServiceEmailToAppellant
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.email_address'), appellantEmail)
			.addJsonValueExpectation(JsonPathExpression.create('$.reference'), caseReference)
			.addJsonValueExpectation(
				JsonPathExpression.create("$.personalisation['unique code']"),
				new RegExp(`[0-9]{${appConfiguration.secureCodes.finalComments.length}}`)
			);

		expectedHorizonInteractions = [expectedGetCaseRefInteraction, expectedGetCaseRefInteraction];
		expectedNotifyInteractions = [expectedSecureCodeEmailSentToAppellantInteraction];
	});

	it('should return an error when requesting to create a final comment that has the same case reference as one already created', async () => {
		// Given: a request to create a final comments entry for a case is made
		const caseReference = uuid.v4();
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// When: we issue the request again
		const postResponse = await _createFinalComment(caseReference, appellantEmail);

		// Then: we should get 409 in the POST response
		expect(postResponse.status).toBe(409);

		// And: there should be no data on the message queue
		expectedMessages = [];

		// And: external systems should be interacted with in the following ways
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});

	it(
		'should return an error when requesting a secure code for a final comment entity that does not exist, ' +
			'not contact Horizon for a final comment end date, not send an email to the appellant, and not produce ' +
			'any message on the message queue',
		async () => {
			// When: we try to get a secure code for a final comment entry using a case reference that does not exist
			const getResponse = await appealsApi.get(`/api/v1/final_comments/DOES_NOT_EXIST/secure_code`);

			// Then: we get 404 in the response
			expect(getResponse.status).toBe(404);

			// And: external systems should be interacted with in the following ways
			expectedHorizonInteractions = [];
			expectedNotifyInteractions = [];

			// And: there should be no data on the message queue
			expectedMessages = [];
		}
	);

	it(
		'should return an error when requesting a secure code for a final comment entity that does exist, but its ' +
			'final comments end date has not been set. It should contact Horizon for a final comment end date, but not ' +
			'send an email to the appellant, and not produce any message on the message queue',
		async () => {
			// Given: there is a valid final comment entity
			const caseReference = uuid.v4();
			const appellantEmail = 'foo@bar.com';
			await _createFinalComment(caseReference, appellantEmail);

			// And: the final comments end date has not been set
			await mockedExternalApis.mockHorizonGetCaseResponse(undefined, 200);

			// When: we try to get the secure code for the final comment entity
			const getResponse = await appealsApi.get(
				`/api/v1/final_comments/${caseReference}/secure_code`
			);

			// Then: we should get a 403 in the response
			expect(getResponse.status).toEqual(403);

			// And: external systems should be interacted with in the following ways
			const expectedGetCaseRefInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(4)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.GetCase.__soap_op'),
					'http://tempuri.org/IHorizon/GetCase'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.GetCase.__xmlns'),
					'http://tempuri.org/'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.GetCase.caseReference'),
					caseReference
				);

			expectedHorizonInteractions = [expectedGetCaseRefInteraction];
			expectedNotifyInteractions = [];

			// And: there should be no data on the message queue
			expectedMessages = [];
		}
	);

	it(
		'should return an error when requesting a secure code for a final comment entity that does exist, but its ' +
			'final comments end date is in the past. It should contact Horizon for a final comment end date, but not ' +
			'send an email to the appellant, and not produce any message on the message queue',
		async () => {
			// Given: there is a valid final comment entity
			const caseReference = uuid.v4();
			const appellantEmail = 'foo@bar.com';
			await _createFinalComment(caseReference, appellantEmail);

			// And: the final comments end date is in the past
			await mockedExternalApis.mockHorizonGetCaseResponse(new Date(1981, 9, 14, 0, 0, 0), 200);

			// When: we try to get the secure code for the final comment entity
			const getResponse = await appealsApi.get(
				`/api/v1/final_comments/${caseReference}/secure_code`
			);

			// Then: we should get a 403 in the response
			expect(getResponse.status).toEqual(403);

			// And: external systems should be interacted with in the following ways
			const expectedGetCaseRefInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(4)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.GetCase.__soap_op'),
					'http://tempuri.org/IHorizon/GetCase'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.GetCase.__xmlns'),
					'http://tempuri.org/'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.GetCase.caseReference'),
					caseReference
				);

			expectedHorizonInteractions = [expectedGetCaseRefInteraction];
			expectedNotifyInteractions = [];

			// And: there should be no data on the message queue
			expectedMessages = [];
		}
	);

	it('should throw an error if horizon does not return a 200 response', async () => {
		// Given: a request to create a final comments entry for a case
		const caseReference = uuid.v4();
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// And: Horizon returns a 500
		await mockedExternalApis.mockHorizonGetCaseResponse(undefined, 500);

		// When: we try to get the secure code for the final comment entity
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}/secure_code`);

		// Then: we should get a 403 in the response
		expect(getResponse.status).toEqual(403);

		// And: external systems should be interacted with in the following ways
		const expectedGetCaseRefInteraction = new Interaction()
			.setNumberOfKeysExpectedInJson(4)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__soap_op'),
				'http://tempuri.org/IHorizon/GetCase'
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__xmlns'),
				'http://tempuri.org/'
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.GetCase.caseReference'), caseReference);

		expectedHorizonInteractions = [expectedGetCaseRefInteraction];
		expectedNotifyInteractions = [];

		// And: there should be no data on the message queue
		expectedMessages = [];
	});

	////////////////////////////////////////////////
	///// GET `final_comments/{caseReference}` /////
	////////////////////////////////////////////////

	it('should return 404 if the case reference specified does not map to a known final comment', async () => {
		// When: we try to get a final comment entry using a case reference that does not exist
		const getResponse = await appealsApi.get(`/api/v1/final_comments/DOES_NOT_EXIST`);

		// Then: we get 404 in the response
		expect(getResponse.status).toBe(404);

		// And: external systems should be interacted with in the following ways
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];

		// And: there should be no data on the message queue
		expectedMessages = [];
	});

	it('should return 403 if the case reference specified does map to a known final comment, but the final comment window has not been specified', async () => {
		// Given: a request to create a final comments entry for a case
		const caseReference = uuid.v4();
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// And: the final comments end date has not been set
		await mockedExternalApis.mockHorizonGetCaseResponse(undefined, 200);

		// When: we try to get the secure code for the final comment entity
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get a 403 in the response
		expect(getResponse.status).toEqual(403);

		// And: external systems should be interacted with in the following ways
		const expectedGetCaseRefInteraction = new Interaction()
			.setNumberOfKeysExpectedInJson(4)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__soap_op'),
				'http://tempuri.org/IHorizon/GetCase'
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__xmlns'),
				'http://tempuri.org/'
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.GetCase.caseReference'), caseReference);

		expectedHorizonInteractions = [expectedGetCaseRefInteraction];
		expectedNotifyInteractions = [];

		// And: there should be no data on the message queue
		expectedMessages = [];
	});

	it('should return 403 if the case reference specified does map to a known final comment, but the final comment window is no longer open', async () => {
		// Given: a request to create a final comments entry for a case
		const caseReference = uuid.v4();
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// And: the final comments end date has not been set
		await mockedExternalApis.mockHorizonGetCaseResponse(new Date(1986, 8, 26, 0, 0, 0), 200);

		// When: we try to get the secure code for the final comment entity
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get a 403 in the response
		expect(getResponse.status).toEqual(403);

		// And: external systems should be interacted with in the following ways
		const expectedGetCaseRefInteraction = new Interaction()
			.setNumberOfKeysExpectedInJson(4)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__soap_op'),
				'http://tempuri.org/IHorizon/GetCase'
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__xmlns'),
				'http://tempuri.org/'
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.GetCase.caseReference'), caseReference);

		expectedHorizonInteractions = [expectedGetCaseRefInteraction];
		expectedNotifyInteractions = [];

		// And: there should be no data on the message queue
		expectedMessages = [];
	});

	it('should return 301 if the case reference specified does map to a known final comment, and the final comment window is open, but the secure code has expired', async () => {
		// Given: a request to create a final comments entry for a case
		const originalSecureCodeExpirationTime =
			appConfiguration.secureCodes.finalComments.expirationTimeInMinutes;
		appConfiguration.secureCodes.finalComments.expirationTimeInMinutes = 0.000001;
		const caseReference = uuid.v4();
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);
		appConfiguration.secureCodes.finalComments.expirationTimeInMinutes =
			originalSecureCodeExpirationTime;

		// And: the final comments end date is set in the future
		await mockedExternalApis.mockHorizonGetCaseResponse(new Date(2100, 1, 1, 0, 0, 0), 200);

		// When: we try to get the secure code for the final comment entity
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get a 301 in the response (we can redirect the user to GET `final_comments/{caseReference}/secure_code)
		expect(getResponse.status).toEqual(301);

		// And: external systems should be interacted with in the following ways
		const expectedGetCaseRefInteraction = new Interaction()
			.setNumberOfKeysExpectedInJson(4)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__soap_op'),
				'http://tempuri.org/IHorizon/GetCase'
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__xmlns'),
				'http://tempuri.org/'
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.GetCase.caseReference'), caseReference);

		expectedHorizonInteractions = [expectedGetCaseRefInteraction];
		expectedNotifyInteractions = [];

		// And: there should be no data on the message queue
		expectedMessages = [];
	});

	it('should return 403 if the case reference specified does map to a known final comment, and the final comment window is open, and the secure code is active, but the secure code is incorrect', async () => {
		// Given: a request to create a final comments entry for a case
		const caseReference = uuid.v4();
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// And: the final comments end date is set in the future
		await mockedExternalApis.mockHorizonGetCaseResponse(new Date(2100, 1, 1, 0, 0, 0), 200);

		// And: we encrypt the secure code
		const encryptedSecureCode = _encryptValue('gandalf');

		// When: we try to get the secure code for the final comment entity with a secure code header
		const getResponse = await appealsApi
			.get(`/api/v1/final_comments/${caseReference}`)
			.set('secure_code', encryptedSecureCode);

		// Then: we should get a 403 in the response
		expect(getResponse.status).toEqual(403);

		// And: external systems should be interacted with in the following ways
		const expectedGetCaseRefInteraction = new Interaction()
			.setNumberOfKeysExpectedInJson(4)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__soap_op'),
				'http://tempuri.org/IHorizon/GetCase'
			)
			.addJsonValueExpectation(
				JsonPathExpression.create('$.GetCase.__xmlns'),
				'http://tempuri.org/'
			)
			.addJsonValueExpectation(JsonPathExpression.create('$.GetCase.caseReference'), caseReference);

		expectedHorizonInteractions = [expectedGetCaseRefInteraction];
		expectedNotifyInteractions = [];

		// And: there should be no data on the message queue
		expectedMessages = [];
	});
});

const _createAppeal = async (householderAppeal = appealFixtures.newHouseholderAppeal()) => {
	const appealCreatedResponse = await appealsApi.post('/api/v1/appeals');
	const appealCreated = appealCreatedResponse.body;

	householderAppeal.id = appealCreated.id;
	const savedAppealResponse = await appealsApi
		.put(`/api/v1/appeals/${appealCreated.id}`)
		.send(householderAppeal);

	return savedAppealResponse;
};

const _createFinalComment = async (caseReference, appellantEmail) => {
	return await appealsApi
		.post('/api/v1/final_comments')
		.send({ case_reference: caseReference, appellant_email: appellantEmail });
};

const _encryptValue = (value) => {
	const cipher = crypto.createCipheriv(
		appConfiguration.secureCodes.finalComments.decipher.algorithm,
		appConfiguration.secureCodes.finalComments.decipher.securityKey,
		appConfiguration.secureCodes.finalComments.decipher.initVector
	);
	let encryptedValue = cipher.update(
		value,
		// The following two arguments are reversed since we only need a decipher in the app, but we're ciphering here
		appConfiguration.secureCodes.finalComments.decipher.outputEncoding,
		appConfiguration.secureCodes.finalComments.decipher.inputEncoding
	);
	encryptedValue += cipher.final(appConfiguration.secureCodes.finalComments.decipher.inputEncoding);
	return encryptedValue;
};
