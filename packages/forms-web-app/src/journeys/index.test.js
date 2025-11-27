jest.setTimeout(10000);

const apiBaseUrl = 'https://example.com';
const originalDocumentsUrl = process.env.DOCUMENTS_SERVICE_API_URL;
process.env.DOCUMENTS_SERVICE_API_URL = `${apiBaseUrl}/docs`;

const { parseHtml } = require('#tests/html-parser');
const escapeHtml = require('escape-html');
const crypto = require('crypto');

const nock = require('nock');
nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');
const mockExternalRequests = nock(apiBaseUrl);
const path = require('path');
const testFileUploadPath = path.join(__dirname, 'fixtures', 'test.pdf');

// session
const originalSessionKey = process.env.SESSION_KEY;
process.env.SESSION_KEY = 'test-session-secret';
jest.mock('../../src/lib/session', () => {
	const session = require('express-session');
	return () => ({
		store: new session.MemoryStore(),
		secret: 'test-session-secret',
		name: 'connect.sid',
		resave: false,
		saveUninitialized: false,
		cookie: {
			sameSite: 'lax',
			httpOnly: true
		}
	});
});

// auth
jest.mock('#middleware/lpa-dashboard/require-user');
const requireUserFromSession = require('#middleware/lpa-dashboard/require-user');
jest.mock('#middleware/check-logged-in');
const checkLoggedIn = require('#middleware/check-logged-in');

// security
jest.mock('lusca', () => ({
	csrf: () => (req, res, next) => next()
}));

// featureFlags
jest.mock('../featureFlag');
const { isFeatureActive } = require('../featureFlag');

// api clients
jest.mock('#middleware/create-api-clients', () => ({
	createApiClients: (req, res, next) => {
		const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
		const { DocumentsApiClient } = require('@pins/common/src/client/documents-api-client');
		req.appealsApiClient = new AppealsApiClient(`${apiBaseUrl}/appeals`);
		req.docsApiClient = new DocumentsApiClient(`${apiBaseUrl}/docs`);
		next();
	}
}));
jest.mock('@pins/common/src/client/clamav-client');
jest.mock('@pins/common/src/client/blob-storage-client.js');

// skip validation - would otherwise require setup of valid example values for every question, this can be setup later
jest.mock('@pins/dynamic-forms/src/validator/validator', () => () => (req, res, next) => next());

// skip example dates to avoid issues dates in snapshots
jest.mock('../dynamic-forms/questions-utils', () => ({
	getExampleDate: jest.fn(() => '5 6 2025')
}));

const request = require('supertest');
const app = require('../app');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const caseTypeArray = Object.values(CASE_TYPES);

const { JOURNEY_TYPES, JOURNEY_TYPE } = require('@pins/common/src/dynamic-forms/journey-types');
const { journeys } = require('./index');
const { JourneyResponse } = require('@pins/dynamic-forms/src/journey-response');

const fakeTimers = require('@sinonjs/fake-timers');
const {
	mapAppealTypeToDisplayTextWithAnOrA
} = require('@pins/common/src/appeal-type-to-display-text');

describe('Dynamic forms journey tests', () => {
	let clock, today, future;
	nock.cleanAll();

	beforeAll(() => {
		clock = fakeTimers.install({ now: new Date('2025-07-31T12:00:00Z'), toFake: ['Date'] });
		today = new Date('2025-07-31T12:00:00Z');
		future = new Date();
		future.setMonth(future.getMonth() + 1);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		isFeatureActive.mockImplementation(() => true);
	});

	afterAll(() => {
		clock.uninstall();
		process.env.SESSION_KEY = originalSessionKey;
		process.env.DOCUMENTS_SERVICE_API_URL = originalDocumentsUrl;
		nock.cleanAll();
		nock.enableNetConnect();
		nock.restore();
	});

	describe('appellant', () => {
		const journeyId = 'test-id';
		const mockUser = {
			id: 'test-user-id',
			email: 'test@example.com',
			expiry: future
		};

		beforeEach(() => {
			checkLoggedIn.mockImplementation((req, res, next) => {
				req.session = req.session || {};
				req.session.user = mockUser;
				req.session.appeal = {
					appealType: 'test'
				};
				req.session.navigationHistory = [];
				next();
			});
		});

		caseTypeArray.forEach((caseType) => {
			describe(`${caseType.type}`, () => {
				const ref = crypto.randomUUID();
				const baseQuestionUrl = `/appeals/api/v2/appellant-submissions/${ref}`;

				beforeEach(() => {
					mockExternalRequests.get(baseQuestionUrl).reply(200, {
						applicationDecisionDate: today?.toISOString(),
						appealTypeCode: caseType.processCode,
						enforcementEffectiveDate: today?.toISOString(),
						SubmissionAddress: [],
						SubmissionLinkedCase: [],
						SubmissionListedBuilding: [],
						SubmissionDocumentUpload: []
					});
				});

				const journeyType = Object.values(JOURNEY_TYPES).find(
					(x) => x.type === JOURNEY_TYPE.appealForm && x.caseType === caseType.processCode
				);

				if (!journeyType) {
					it.skip(`${caseType.type}: has not implemented an appeal form`, () => {});
					return;
				}

				it('renders listing page', async () => {
					const res = await request(app).get(
						`/appeals/${caseType.friendlyUrl}/appeal-form/your-appeal?id=${ref}`
					);
					expect(res.status).toBe(200);

					const element = parseHtml(res.text, {
						replacements: {
							[ref]: 'appeal-ref'
						}
					});
					expect(element.pretty()).toMatchSnapshot();
					expect(element.text).toContain('Your appeal');
				});

				const journeyResponse = new JourneyResponse(journeyType.id, journeyId, {}, 'test-lpa-code');
				const journey = journeys.getJourney(journeyResponse);

				journey.sections.forEach((section) => {
					section.questions.forEach((question) => {
						it(`${caseType.type} should render the ${question.getUrlSlug()} question`, async () => {
							const res = await request(app).get(
								`/appeals/${caseType.friendlyUrl}/${section.segment}/${question.getUrlSlug()}?id=${ref}`
							);

							expect(res.status).toBe(200);

							const element = parseHtml(res.text, {
								replacements: {
									[ref]: 'appeal-ref'
								}
							});
							expect(element.pretty()).toMatchSnapshot();
							expect(element.text).toContain(section.name.trim());

							questionExpectations(question, element, caseType);
						});

						/**
						 * @param {Record<string, string>} answer
						 */
						const defaultSaveAction = (answer) => {
							return request(app)
								.post(
									`/appeals/${caseType.friendlyUrl}/${section.segment}/${question.getUrlSlug()}?id=${ref}`
								)
								.send(answer);
						};

						/**
						 *
						 * @param {import('@pins/dynamic-forms/src/question')} q
						 * @returns { { postOverride?: function, answer?: Record<String, string>, saveEndpoints: import('nock').Scope[] } | null }
						 */
						const questionTypeDetails = (q) => {
							switch (q.constructor.name) {
								case 'BooleanQuestion':
									return {
										answer: { [q.fieldName]: 'yes' },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'CheckboxQuestion':
								case 'OptionsQuestion':
								case 'RadioQuestion':
									return {
										answer: { [q.fieldName]: q.options[0].value },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'DateQuestion':
									return {
										answer: {
											[q.fieldName + '_day']: '15',
											[q.fieldName + '_month']: '07',
											[q.fieldName + '_year']: '2025'
										},
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'MultiFieldInputQuestion':
									return {
										answer: q.inputFields.reduce((acc, field) => {
											acc[field.fieldName] = 'test';
											return acc;
										}, {}),
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'NumberEntryQuestion':
									return {
										answer: { [q.fieldName]: '10' },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'SingleLineInputQuestion':
								case 'TextEntryQuestion':
									return {
										answer: { [q.fieldName]: 'test answer' },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'SiteAddressQuestion':
									return {
										answer: {
											[q.fieldName + '_addressLine1']: 'test',
											[q.fieldName + '_addressLine2']: 'test',
											[q.fieldName + '_townCity']: 'test',
											[q.fieldName + '_county']: 'test',
											[q.fieldName + '_postcode']: 'AB1 2CD'
										},
										saveEndpoints: [
											nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {}),
											nock(apiBaseUrl).post(`${baseQuestionUrl}/address`).reply(202, {})
										]
									};
								case 'UnitOptionEntryQuestion':
									return {
										answer: {
											[q.fieldName]: q.options[0].value,
											[q.fieldName + q.options?.conditional?.fieldName]: '10'
										},
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'MultiFileUploadQuestion':
									return {
										postOverride: () => {
											return request(app)
												.post(
													`/appeals/${caseType.friendlyUrl}/${section.segment}/${question.getUrlSlug()}?id=${ref}`
												)
												.attach(question.fieldName, testFileUploadPath);
										},
										saveEndpoints: [
											nock(apiBaseUrl)
												.post(new RegExp(`/docs/api/v1/${journeyType.id}:[a-f0-9\\-]+$`))
												.reply(202, {
													id: '123'
												}),
											nock(apiBaseUrl).post(`${baseQuestionUrl}/document-upload`).reply(202, {}),
											nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})
										]
									};
								// skipping due to variations/complications in list questions for now
								case 'ListAddMoreQuestion':
									return null;
								default:
									throw new Error(q.constructor.name + ' not handled in journey save tests');
							}
						};

						const saveSetup = questionTypeDetails(question);

						if (!saveSetup) {
							it.skip(`${caseType.type} should save the ${question.getUrlSlug()} question`, () => {});
						} else {
							it(`${caseType.type} should save the ${question.getUrlSlug()} question`, async () => {
								const res = saveSetup.postOverride
									? await saveSetup.postOverride()
									: await defaultSaveAction(saveSetup.answer);

								saveSetup.saveEndpoints.forEach((endpoint) => {
									expect(endpoint.isDone()).toBe(true);
								});

								// ensure we are redirected to a page within the journey
								expect(res.status).toBe(302);
								expect(res.header.location).toContain(ref);
							});
						}
					});
				});
			});
		});
	});

	describe('lpa', () => {
		const mockLpaUser = {
			id: 'test-user-id',
			email: 'test@example.com',
			isLpaUser: true,
			lpaStatus: 'confirmed',
			expiry: new Date(Date.now() + 1000000),
			lpaCode: 'TEST_LPA_CODE'
		};

		const baseUrl = '/manage-appeals';

		beforeEach(() => {
			requireUserFromSession.mockImplementation((req, res, next) => {
				req.session = req.session || {};
				req.session.user = mockLpaUser;
				req.session.navigationHistory = [];
				next();
			});
		});

		caseTypeArray.forEach((caseType) => {
			describe(`${caseType.type}`, () => {
				const ref = crypto.randomUUID();

				const mockAppealDetails = {
					caseReference: ref,
					appealTypeCode: caseType.processCode,
					users: [
						{
							id: 'test-user-id',
							serviceUserType: 'APPELLANT',
							firstName: 'Test',
							lastName: 'User'
						}
					]
				};

				const journeyType = Object.values(JOURNEY_TYPES).find(
					(x) => x.type === JOURNEY_TYPE.questionnaire && x.caseType === caseType.processCode
				);

				if (!journeyType) {
					it.skip(`${caseType.type}: has not implemented an LPAQ`, () => {});
					return;
				}

				it('renders listing page', async () => {
					mockExternalRequests
						.get(new RegExp(`/appeals/api/v2/users/test-user-id/appeal-cases/${ref}`))
						.times(2) // todo: fix this inefficient duplciate call, this setup can then be shared with question tests
						.reply(200, {
							...mockAppealDetails,
							caseType: caseType.processCode,
							lpaQuestionnaireDueDate: future
						});

					mockExternalRequests
						.get(`/appeals/api/v2/appeal-cases/${ref}/lpa-questionnaire-submission`)
						.reply(200, {
							AppealCase: {
								LPACode: mockLpaUser.lpaCode
							}
						});

					const res = await request(app).get(`${baseUrl}/questionnaire/${ref}`);
					expect(res.status).toBe(200);

					const element = parseHtml(res.text, {
						replacements: {
							[ref]: 'appeal-ref'
						}
					});
					if (!element) throw new Error('Failed to parse HTML');
					expect(element.pretty()).toMatchSnapshot();
					expect(element.innerHTML).toContain('Appeal questionnaire');
				});

				const journeyResponse = new JourneyResponse(journeyType.id, ref, {}, 'test-lpa-code');
				const journey = journeys.getJourney(journeyResponse);

				journey.sections.forEach((section) => {
					section.questions.forEach((question) => {
						const baseQuestionUrl = `/appeals/api/v2/appeal-cases/${ref}/lpa-questionnaire-submission`;

						const setupQuestionNocks = () => {
							mockExternalRequests
								.get(new RegExp(`/appeals/api/v2/users/test-user-id/appeal-cases/${ref}`))
								.times(1)
								.reply(200, {
									...mockAppealDetails,
									caseType: caseType.processCode,
									lpaQuestionnaireDueDate: future
								});

							mockExternalRequests.get(baseQuestionUrl).reply(200, {
								AppealCase: {
									LPACode: mockLpaUser.lpaCode
								}
							});
						};

						it(`${caseType.type} should render the ${question.getUrlSlug()} question`, async () => {
							setupQuestionNocks();

							const res = await request(app).get(
								`${baseUrl}/questionnaire/${ref}/${section.segment}/${question.getUrlSlug()}`
							);

							expect(res.status).toBe(200);

							const element = parseHtml(res.text, {
								replacements: {
									[ref]: 'appeal-ref'
								}
							});
							expect(element.pretty()).toMatchSnapshot();
							expect(element.text).toContain(section.name.trim());

							questionExpectations(question, element, caseType);
						});

						/**
						 * @param {Record<string, string>} answer
						 */ //:referenceId/:section/:question',
						const defaultSaveAction = (answer) => {
							return request(app)
								.post(
									`/manage-appeals/questionnaire/${ref}/${section.segment}/${question.getUrlSlug()}`
								)
								.send(answer);
						};

						/**
						 *
						 * @param {import('@pins/dynamic-forms/src/question')} q
						 * @returns { { postOverride?: function, answer?: Record<String, string>, saveEndpoints: import('nock').Scope[] } | null }
						 */
						const questionTypeDetails = (q) => {
							switch (q.constructor.name) {
								case 'BooleanQuestion':
									return {
										answer: { [q.fieldName]: 'yes' },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'CheckboxQuestion':
								case 'OptionsQuestion':
								case 'RadioQuestion':
									return {
										answer: { [q.fieldName]: q.options[0].value },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'DateQuestion':
									return {
										answer: {
											[q.fieldName + '_day']: '15',
											[q.fieldName + '_month']: '07',
											[q.fieldName + '_year']: '2025'
										},
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'MultiFieldInputQuestion':
									return {
										answer: q.inputFields.reduce((acc, field) => {
											acc[field.fieldName] = 'test';
											return acc;
										}, {}),
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'NumberEntryQuestion':
									return {
										answer: { [q.fieldName]: '10' },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'SingleLineInputQuestion':
								case 'TextEntryQuestion':
									return {
										answer: { [q.fieldName]: 'test answer' },
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'SiteAddressQuestion':
									return {
										answer: {
											[q.fieldName + '_addressLine1']: 'test',
											[q.fieldName + '_addressLine2']: 'test',
											[q.fieldName + '_townCity']: 'test',
											[q.fieldName + '_county']: 'test',
											[q.fieldName + '_postcode']: 'AB1 2CD'
										},
										saveEndpoints: [
											nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {}),
											nock(apiBaseUrl).post(`${baseQuestionUrl}/address`).reply(202, {})
										]
									};
								case 'UnitOptionEntryQuestion':
									return {
										answer: {
											[q.fieldName]: q.options[0].value,
											[q.fieldName + q.options?.conditional?.fieldName]: '10'
										},
										saveEndpoints: [nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})]
									};
								case 'MultiFileUploadQuestion':
									return {
										postOverride: () => {
											return request(app)
												.post(
													`/manage-appeals/questionnaire/${ref}/${section.segment}/${question.getUrlSlug()}`
												)
												.attach(question.fieldName, testFileUploadPath);
										},
										saveEndpoints: [
											nock(apiBaseUrl)
												.post(new RegExp(`/docs/api/v1/${journeyType.id}:[a-f0-9\\-]+$`))
												.reply(202, {
													id: '123'
												}),
											nock(apiBaseUrl).post(`${baseQuestionUrl}/document-upload`).reply(202, {}),
											nock(apiBaseUrl).patch(baseQuestionUrl).reply(202, {})
										]
									};
								// skipping due to variations/complications in list questions for now
								case 'ListAddMoreQuestion':
									return null;
								default:
									throw new Error(q.constructor.name + ' not handled in journey save tests');
							}
						};

						const saveSetup = questionTypeDetails(question);

						if (!saveSetup) {
							it.skip(`${caseType.type} should save the ${question.getUrlSlug()} question`, () => {});
						} else {
							it(`${caseType.type} should save the ${question.getUrlSlug()} question`, async () => {
								setupQuestionNocks();

								const res = saveSetup.postOverride
									? await saveSetup.postOverride()
									: await defaultSaveAction(saveSetup.answer);

								saveSetup.saveEndpoints.forEach((endpoint) => {
									expect(endpoint.isDone()).toBe(true);
								});

								// ensure we are redirected to a page within the journey
								expect(res.status).toBe(302);
								expect(res.header.location).toContain(ref);
							});
						}
					});
				});
			});
		});
	});
});

/**
 * @param {import('@pins/dynamic-forms/src/question')} question
 * @param {import('node-html-parser').HTMLElement} element
 * @param {import('@pins/common/src/database/data-static').CASE_TYPE} caseType
 */
const questionExpectations = (question, element, caseType) => {
	/**
	 * @param {import('@pins/common/src/database/data-static').CASE_TYPE} type
	 * @returns {string}
	 */
	const getAppealTypeStringWithAnOrA = (type) => {
		return mapAppealTypeToDisplayTextWithAnOrA(type);
	};

	switch (question.constructor.name) {
		case 'ListAddMoreQuestion':
			expect(element.text).toContain(question.subQuestion.question.trim());
			break;
		default:
			// how to avoid the need for ’ replacements?
			// html encode question and compare with innerhtml?
			expect(element.innerHTML).toContain(
				escapeHtml(
					question.question
						.replace('<appeal type with an or a>', getAppealTypeStringWithAnOrA(caseType))
						.replace('<individual name>', 'Named Individual')
						.replace('<dynamic named parties>', 'Named Individual')
						.trim()
				)
			);
			break;
	}
};
