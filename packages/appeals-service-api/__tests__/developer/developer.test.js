const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const container = require('rhea');
const crypto = require('crypto');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const { householderAppeal } = require('./fixtures/householder-appeal');
// const { expectedCreateOrganisationHorizonRequest } = require('./fixtures/horizon-inputs') //TODO: UNCOMMENT
const { TestMessageQueue } = require('./external-dependencies/message-queue/test-message-queue');
const { MockedExternalApis } = require('./external-dependencies/rest-apis/mocked-external-apis');
const { Interaction } = require('./external-dependencies/rest-apis/interaction');
const { JsonPathExpression } = require('./external-dependencies/rest-apis/json-path-expression');
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
let testLpaName = 'System Test Borough Council';

jest.setTimeout(120000);
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
	appConfiguration.services.notify.templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant = 3;
	appConfiguration.documents.url = mockedExternalApis.getDocumentsAPIUrl();

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);

	/////////////////////////
	///// POPULATE LPAS /////
	/////////////////////////

	// TODO: the database needs this CSV row putting into it so that emails work X__X
	const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;E69999999;;${testLpaName};${testLpaEmail};;TRUE}`;
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
		householderAppeal.id = uuid.v4();
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
	it.only.each([
		['a blank Horizon ID field', (appeal) => (appeal.horizonId = '')]
		// [
		// 	'no Horizon ID field',
		// 	(appeal) => {
		// 		delete appeal.horizonId;
		// 	}
		// ]
	])(
		'should submit an appeal to horizon and send emails to the appellant and case worker when horizon reports a success in upload',
		async (condition, setHorizonIdOnAppeal) => {
			// Given: that we use the Horizon integration back office strategy
			isFeatureActive.mockImplementation(() => {
				return true;
			});

			// And: an appeal is created that is not known to the back office
			setHorizonIdOnAppeal(householderAppeal);
			const createAppealResponse = await _createAppeal();
			let createdAppeal = createAppealResponse.body;

			// And: the documents API is mocked
			const appealDocuments = [
				householderAppeal.requiredDocumentsSection.originalApplication.uploadedFile,
				householderAppeal.requiredDocumentsSection.decisionLetter.uploadedFile,
				householderAppeal.yourAppealSection.appealStatement.uploadedFile,
				...householderAppeal.yourAppealSection.otherDocuments.uploadedFiles,
				householderAppeal.appealSubmission.appealPDFStatement.uploadedFile
			]
			
			appealDocuments.forEach(async (document) => {
				await mockedExternalApis.mockDocumentsApiResponse(
					200,
					createdAppeal.id,
					document,
					true
				);
			});

			// And: Horizon's create organisation endpoint is mocked, first for organisations, then contacts
			const mockedOrganisationId = 'O_1234';
			await mockedExternalApis.mockHorizonCreateContactResponse(200, mockedOrganisationId);
			const mockedContactId = 'P_1234';
			await mockedExternalApis.mockHorizonCreateContactResponse(200, mockedContactId);

			// And: Horizon's create appeal endpoint is mocked
			const mockedCaseReference = 'APP/Z0116/D/20/3218465';
			await mockedExternalApis.mockHorizonCreateAppealResponse(200, mockedCaseReference);

			// And: Horizon's upload documents endpoint is mocked
			await mockedExternalApis.mockHorizonUploadDocumentResponse(200);
			await mockedExternalApis.mockHorizonUploadDocumentResponse(200);

			// When: the appeal is submitted to the back office
			const submittedToBackOfficeResponse = await appealsApi.put(
				`/api/v1/back-office/appeals/${createdAppeal.id}`
			);

			// And: the appeal is then retrieved from the appeals API
			const retrievedAppealResponse = await appealsApi.get(`/api/v1/appeals/${createdAppeal.id}`);

			// Then: the status code for the submission request should be 200
			expect(submittedToBackOfficeResponse.status).toBe(200);

			// And: the status code for the retrieval request should be 200
			expect(retrievedAppealResponse.status).toBe(200);

			// And: the appeal should have been updated in the following ways:
			//      - Its `state` field should be updated
			//      - Its `submissionDate` field should be set
			//      - Its `updatedAt` field should be updated
			//      - Its `horizonId` field should be set
			createdAppeal.state = 'SUBMITTED';
			createdAppeal.submissionDate = submittedToBackOfficeResponse.body.submissionDate;
			createdAppeal.updatedAt = submittedToBackOfficeResponse.body.updatedAt;
			createdAppeal.horizonId = '3218465';
			expect(retrievedAppealResponse.body).toMatchObject(createdAppeal);

			// And: Horizon has been interacted with as expected
			const createOrganisationInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(10) // This value will change
				.addJsonValueExpectation(
					JsonPathExpression.create('$.AddContact.__soap_op'),
					'http://tempuri.org/IContacts/AddContact'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.AddContact.__xmlns'),
					'http://tempuri.org/'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['__xmlns:a']"),
					'http://schemas.datacontract.org/2004/07/Contacts.API'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['__xmlns:i']"),
					'http://www.w3.org/2001/XMLSchema-instance'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['a:Name'].appellant.value.['__i:nil']"),
					'true'
				); // This line will change

			const createContactsInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(11) // This value will change
				.addJsonValueExpectation(
					JsonPathExpression.create('$.AddContact.__soap_op'),
					'http://tempuri.org/IContacts/AddContact'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.AddContact.__xmlns'),
					'http://tempuri.org/'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['__xmlns:a']"),
					'http://schemas.datacontract.org/2004/07/Contacts.API'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['__xmlns:i']"),
					'http://www.w3.org/2001/XMLSchema-instance'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['__i:type']"),
					'a:HorizonAPIPerson'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['a:Email']"),
					'test@pins.com'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['a:FirstName']"),
					'Appellant'
				) // This will change
				.addJsonValueExpectation(
					JsonPathExpression.create("$.AddContact.contact.['a:LastName']"),
					'Name'
				); // This will change
			//.addJsonValueExpectation(JsonPathExpression.create('$.AddContact.contact.a:OrganisationID'), mockedOrganisationId) // This will change //TODO: UNCOMMENT

			const createAppealInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(95) // This will change depending on the number of contacts
				.addJsonValueExpectation(
					JsonPathExpression.create('$.CreateContact.__soap_op'),
					'http://tempuri.org/IHorizon/CreateCase'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.CreateContact.__xmlns'),
					'http://tempuri.org/'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.CreateContact.caseType'),
					'Householder (HAS) Appeal'
				) // this will change
				.addJsonValueExpectation(JsonPathExpression.create('$.CreateContact.LPACode'), 'E69999999')
				.addJsonValueExpectation(
					JsonPathExpression.create('$.CreateContact.dateOfReceipt'),
					new RegExp(`.+`)
				)
				.addJsonValueExpectation(JsonPathExpression.create('$.CreateContact.location'), 'England') // this will change
				.addJsonValueExpectation(
					JsonPathExpression.create("$.CreateContact.category.['__xlns:a']"),
					'http://schemas.datacontract.org/2004/07/Horizon.Business'
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.CreateContact.category.['__xlns:i']"),
					'http://www.w3.org/2001/XMLSchema-instance'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					0,
					"['Case:Casework Reason']",
					''
				) // this will change
				.addDateAttributeExpectationForHorizonCreateAppealInteraction(
					1,
					"['Case Dates:Receipt Date']"
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					2,
					"['Case:Source Indicator']",
					'Other'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					3,
					"['Case:Case Publish Flag']",
					'No'
				)
				.addDateAttributeExpectationForHorizonCreateAppealInteraction(
					4,
					"['Planning Application:Date Of LPA Decision']",
					householderAppeal.decisionDate.toISOString()
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					5,
					"['Case:Procedure (Appellant)']",
					'Written Representations'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					6,
					"['Planning Application:LPA Application Reference']",
					'12345'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					7,
					"['Case Site:Site Address Line 1']",
					'Site Address 1'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					8,
					"['Case Site:Site Address Line 2']",
					'Site Address 2'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					9,
					"['Case Site:Site Address Town']",
					'Site Town'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					10,
					"['Case Site:Site Address Country']",
					'Site County'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					11,
					"['Case Site:Site Address Postcode']",
					'SW1 1AA'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					12,
					"['Case Site:Ownership Certificate']",
					'null'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					13,
					"['Case Site:Site Viewable From Road']",
					'No'
				)
				.addStringAttributeExpectationForHorizonCreateAppealInteraction(
					14,
					"['Case Site:Inspector Need To Enter Site']",
					'Yes'
				)
				.addContactAttributeExpectationForHorizonCreateAppealInteraction(15)
				.addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
					15,
					0,
					"['Case Involvement:Case Involvement:ContactID']",
					mockedContactId
				)
				.addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
					15,
					1,
					"['Case Involvement:Case Involvement:Contact Details']",
					'Appellant Name'
				)
				.addDateAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
					15,
					2,
					"['Case Involvement:Case Involvement:Involvement Start Date']"
				)
				.addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
					15,
					3,
					"['Case Involvement:Case Involvement:Communication Preference']",
					'e-mail'
				)
				.addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
					15,
					4,
					"['Case Involvement:Case Involvement:Type Of Involvement']",
					'Appellant'
				);
			// there may be more contact attributes here if the appeal is made on behalf of an appellant

			let documentIndex = 0;
			const uploadDocumentInteractions = appealDocuments.map((document) => {
				return new Interaction()
					.setNumberOfKeysExpectedInJson(31)
					.addJsonValueExpectation(
						JsonPathExpression.create('$.AddDocuments.__soap_op'),
						'http://tempuri.org/IHorizon/AddDocuments'
					)
					.addJsonValueExpectation(
						JsonPathExpression.create('$.AddDocuments.__xmlns'),
						'http://tempuri.org/'
					)
					.addJsonValueExpectation(
						JsonPathExpression.create('$.AddDocuments.caseReference'),
						'3218465'
					) // Last 7 digits of mockedCaseReference
					.addExpectationForHorizonCreateDocumentInteraction(documentIndex++, document, true);
			});

			expectedHorizonInteractions = [
				createOrganisationInteraction,
				createContactsInteraction,
				createAppealInteraction,
				...uploadDocumentInteractions
			];

			// And: Notify has been interacted with as expected
			const emailToAppellantInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(8)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.template_id'),
					appConfiguration.services.notify.templates['1001']
						.appealSubmissionConfirmationEmailToAppellant
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.email_address'),
					householderAppeal.email
				)
				.addJsonValueExpectation(JsonPathExpression.create('$.reference'), householderAppeal.id)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.personalisation.name'),
					householderAppeal.aboutYouSection.yourDetails.name
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['appeal site address']"),
					householderAppeal.appealSiteSection.siteAddress.addressLine1 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.addressLine2 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.town +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.county +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.postcode
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['local planning department']"),
					testLpaName
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['pdf copy URL']"),
					`${process.env.APP_APPEALS_BASE_URL}/document/${householderAppeal.id}/${householderAppeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
				);

			const emailToLpaInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(8)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.template_id'),
					appConfiguration.services.notify.templates['1001'].appealNotificationEmailToLpa
				)
				.addJsonValueExpectation(JsonPathExpression.create('$.email_address'), testLpaEmail)
				.addJsonValueExpectation(JsonPathExpression.create('$.reference'), householderAppeal.id)
				.addJsonValueExpectation(JsonPathExpression.create('$.personalisation.LPA'), testLpaName)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['site address']"),
					householderAppeal.appealSiteSection.siteAddress.addressLine1 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.addressLine2 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.town +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.county +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.postcode
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.personalisation.date'),
					householderAppeal.submissionDate.toLocaleDateString('en-GB', {
						day: '2-digit',
						month: 'long',
						year: 'numeric'
					})
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['planning application number']"),
					householderAppeal.planningApplicationNumber
				);
			expectedNotifyInteractions = [emailToAppellantInteraction, emailToLpaInteraction];

			// And: there are no messages on the message queue
			expectedMessages = [];
		}
	);

	it.each([
		['a blank Horizon ID field', (appeal) => (appeal.horizonId = '')],
		[
			'no Horizon ID field',
			(appeal) => {
				delete appeal.horizonId;
			}
		]
	])(
		'should submit an appeal to the back office message queue and send emails to the appellant and case worker when we create and submit an appeal that has %p.',
		async (horizonIdContext, setHorizonIdOnAppeal) => {
			// Given: that we use the message queue back-office strategy
			isFeatureActive.mockImplementation(() => {
				return false;
			});

			// And: an appeal is created that is not known to the back office
			setHorizonIdOnAppeal(householderAppeal);
			const savedAppealResponse = await _createAppeal();
			let savedAppeal = savedAppealResponse.body;

			// When: the appeal is submitted to the back office
			const submittedAppealResponse = await appealsApi.put(
				`/api/v1/back-office/appeals/${savedAppeal.id}`
			);

			// Then: the status code should be 200
			expect(submittedAppealResponse.status).toBe(200);

			// And: the saved appeal data with an additional `submissionDate` and updated `updatedAt` field
			// should be output on the output message queue
			savedAppeal.state = 'SUBMITTED';
			savedAppeal.submissionDate = submittedAppealResponse.body.submissionDate;
			savedAppeal.updatedAt = submittedAppealResponse.body.updatedAt;
			expectedMessages = [savedAppeal];

			// And: external APIs should be interacted with in the following ways
			const emailToAppellantInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(8)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.template_id'),
					appConfiguration.services.notify.templates['1001']
						.appealSubmissionConfirmationEmailToAppellant
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.email_address'),
					householderAppeal.email
				)
				.addJsonValueExpectation(JsonPathExpression.create('$.reference'), householderAppeal.id)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.personalisation.name'),
					householderAppeal.aboutYouSection.yourDetails.name
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['appeal site address']"),
					householderAppeal.appealSiteSection.siteAddress.addressLine1 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.addressLine2 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.town +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.county +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.postcode
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['local planning department']"),
					testLpaName
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['pdf copy URL']"),
					`${process.env.APP_APPEALS_BASE_URL}/document/${householderAppeal.id}/${householderAppeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
				);

			const emailToLpaInteraction = new Interaction()
				.setNumberOfKeysExpectedInJson(8)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.template_id'),
					appConfiguration.services.notify.templates['1001'].appealNotificationEmailToLpa
				)
				.addJsonValueExpectation(JsonPathExpression.create('$.email_address'), testLpaEmail)
				.addJsonValueExpectation(JsonPathExpression.create('$.reference'), householderAppeal.id)
				.addJsonValueExpectation(JsonPathExpression.create('$.personalisation.LPA'), testLpaName)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['site address']"),
					householderAppeal.appealSiteSection.siteAddress.addressLine1 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.addressLine2 +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.town +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.county +
						'\n' +
						householderAppeal.appealSiteSection.siteAddress.postcode
				)
				.addJsonValueExpectation(
					JsonPathExpression.create('$.personalisation.date'),
					householderAppeal.submissionDate.toLocaleDateString('en-GB', {
						day: '2-digit',
						month: 'long',
						year: 'numeric'
					})
				)
				.addJsonValueExpectation(
					JsonPathExpression.create("$.personalisation['planning application number']"),
					householderAppeal.planningApplicationNumber
				);

			expectedHorizonInteractions = [];
			expectedNotifyInteractions = [emailToAppellantInteraction, emailToLpaInteraction];
		}
	);

	it('should not submit an appeal to the back office if the appeal specified does not exist', async () => {
		// When: an unknown appeal is submitted to the back office
		const submittedAppealResponse = await appealsApi.put(`/api/v1/back-office/appeals/NOT_KNOWN`);

		// Then: the status code should be 404
		expect(submittedAppealResponse.status).toBe(404);

		// And: there should be no interactions with the message queue
		expectedMessages = [];

		// And: external APIs should not be interacted with
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});

	it('should not submit an appeal to the back office, if the appeal is known and has a Horizon ID', async () => {
		// Given: an appeal is created and known to the back office
		householderAppeal.horizonId = 'itisknown';
		const savedAppealResponse = await _createAppeal();
		let savedAppeal = savedAppealResponse.body;

		// When: an unknown appeal is submitted to the back office
		const submittedAppealResponse = await appealsApi.put(
			`/api/v1/back-office/appeals/${savedAppeal.id}`
		);

		// Then: the status code should be 409
		expect(submittedAppealResponse.status).toBe(409);

		// And: there should be no interactions with the message queue
		expectedMessages = [];

		// And: external APIs should not be interacted with
		expectedHorizonInteractions = [];
		expectedNotifyInteractions = [];
	});
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

const _createAppeal = async () => {
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
