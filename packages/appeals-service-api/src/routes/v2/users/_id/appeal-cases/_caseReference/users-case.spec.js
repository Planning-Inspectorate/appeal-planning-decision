const crypto = require('crypto');

const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { documentTypes } = require('@pins/common/src/document-types');
const {
	createTestDocData
} = require('../../../../../../../__tests__/developer/fixtures/appeals-document-data');

const email = crypto.randomUUID() + '@example.com';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string|undefined, string|undefined): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

	/**
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

		return user;
	};

	describe('routes/v2/users/_id/appeal-cases/_caseReference', () => {
		describe(`get case`, () => {
			it('should get user case data', async () => {
				const user = await _createSqlUser(email);
				const caseReference = 'get-user-case-data';
				const submission = await sqlClient.appellantSubmission.create({
					data: {
						LPACode: 'lpa_001',
						appealTypeCode: 'HAS',
						Appeal: { create: {} }
					}
				});

				await sqlClient.appealToUser.create({
					data: {
						appealId: submission.appealId,
						role: APPEAL_USER_ROLES.APPELLANT,
						userId: user.id
					}
				});
				await sqlClient.appealCase.create({
					data: {
						Appeal: {
							connect: { id: submission.appealId }
						},
						...createTestAppealCase(caseReference, 'HAS', 'lpa_001')
					}
				});

				await sqlClient.lPAQuestionnaireSubmission.create({
					data: {
						AppealCase: {
							connect: { caseReference: caseReference }
						}
					}
				});
				await sqlClient.submissionLinkedCase.createMany({
					data: [
						{
							caseReference: '4567890',
							fieldName: fieldNames.appellantLinkedCaseReference,
							appellantSubmissionId: submission.id
						},
						{
							caseReference: '4567890',
							fieldName: fieldNames.nearbyAppealReference,
							appellantSubmissionId: submission.id
						}
					]
				});
				await sqlClient.appealCaseRelationship.createMany({
					data: [
						{ caseReference, caseReference2: '1010101' },
						{ caseReference: '1010101', caseReference2: caseReference }
					]
				});

				setCurrentSub(user.id);
				setCurrentLpa(undefined, undefined);
				const response = await appealsApi.get(
					`/api/v2/users/${user.id}/appeal-cases/${caseReference}?role=Appellant`
				);

				expect(response.status).toBe(200);
				expect(response.body.caseReference).toBe(caseReference);
				expect(response.body.submissionLinkedCases.length).toBe(2);
				expect(response.body.relations.length).toBe(1);
			});

			it('only exposes published unredacted documents to their owner group', async () => {
				const owner = await _createSqlUser(crypto.randomUUID() + '@example.com');
				const otherParty = await _createSqlUser(crypto.randomUUID() + '@example.com');
				const unrelatedUser = await _createSqlUser(crypto.randomUUID() + '@example.com');
				const caseReference = 'get-user-case-doc-access';
				const submission = await sqlClient.appellantSubmission.create({
					data: {
						LPACode: 'lpa_001',
						appealTypeCode: 'HAS',
						Appeal: { create: {} }
					}
				});

				await sqlClient.appealToUser.createMany({
					data: [
						{
							appealId: submission.appealId,
							role: APPEAL_USER_ROLES.APPELLANT,
							userId: owner.id
						},
						{
							appealId: submission.appealId,
							role: APPEAL_USER_ROLES.RULE_6_PARTY,
							userId: otherParty.id
						}
					]
				});
				await sqlClient.appealCase.create({
					data: {
						Appeal: {
							connect: { id: submission.appealId }
						},
						...createTestAppealCase(caseReference, 'HAS', 'lpa_001')
					}
				});

				const documentType = documentTypes.uploadAppellantStatementDocuments.dataModelName;
				const ownerDocument = createTestDocData(caseReference, documentType, {
					redacted: false
				});
				const redactedDocument = createTestDocData(caseReference, documentType);
				const unpublishedDocument = createTestDocData(caseReference, documentType, {
					published: false,
					redacted: false
				});
				await sqlClient.document.createMany({
					data: [ownerDocument, redactedDocument, unpublishedDocument]
				});

				setCurrentLpa(undefined, undefined);
				setCurrentSub(owner.id);
				const ownerResponse = await appealsApi.get(
					`/api/v2/users/${owner.id}/appeal-cases/${caseReference}?role=Appellant`
				);

				expect(ownerResponse.status).toBe(200);
				expect(
					ownerResponse.body.Documents.find((document) => document.id === ownerDocument.id)
						.userOwned
				).toBe(true);
				expect(
					ownerResponse.body.Documents.some((document) => document.id === unpublishedDocument.id)
				).toBe(false);

				setCurrentSub(otherParty.id);
				const otherPartyResponse = await appealsApi.get(
					`/api/v2/users/${otherParty.id}/appeal-cases/${caseReference}?role=Rule6Party`
				);

				expect(otherPartyResponse.status).toBe(200);
				expect(
					otherPartyResponse.body.Documents.find((document) => document.id === ownerDocument.id)
						.userOwned
				).toBe(false);
				expect(
					otherPartyResponse.body.Documents.find((document) => document.id === redactedDocument.id)
						.userOwned
				).toBe(true);

				setCurrentSub(unrelatedUser.id);
				const unauthorizedResponse = await appealsApi.get(
					`/api/v2/users/${owner.id}/appeal-cases/${caseReference}?role=Appellant`
				);
				expect(unauthorizedResponse.status).toBe(403);
			});
		});
	});
};
