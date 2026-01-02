const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');
let validUser = '';
const validLpa = 'Q9999';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

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
						role: APPEAL_USER_ROLES.RULE_6_PARTY
					}
				},
				AppealCase: {
					create: createTestAppealCase(caseRef, 'S78', validLpa)
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	describe('/appeal-cases/_caseReference/rule-6-proof-evidence-submission', () => {
		beforeAll(async () => {
			const user = await sqlClient.appealUser.create({
				data: {
					email: crypto.randomUUID() + '@example.com'
				}
			});
			validUser = user.id;
		});
		it('should create a new rule 6 proof of evidence submission', async () => {
			const testCaseRef = '2234127';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6ProofOfEvidenceData = {
				uploadRule6ProofOfEvidenceDocuments: true,
				rule6Witnesses: false,
				uploadRule6WitnessesEvidence: false
			};
			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-proof-evidence-submission`)
				.send(rule6ProofOfEvidenceData);
			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject({ ...rule6ProofOfEvidenceData, userId: validUser });
		});
		it('should retrieve an existing rule 6 proof of evidence submission', async () => {
			const testCaseRef = '2234128';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6ProofOfEvidenceData = {
				uploadRule6ProofOfEvidenceDocuments: true,
				rule6Witnesses: false,
				uploadRule6WitnessesEvidence: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-proof-evidence-submission`)
				.send(rule6ProofOfEvidenceData);
			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/rule-6-proof-evidence-submission`
			);
			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...rule6ProofOfEvidenceData,
				caseReference: testCaseRef,
				userId: validUser
			});
		});
		it('should patch/update an existing rule 6 proof of evidence submission', async () => {
			const testCaseRef = '2234129';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const originalProof = {
				uploadRule6ProofOfEvidenceDocuments: false,
				rule6Witnesses: true,
				uploadRule6WitnessesEvidence: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-proof-evidence-submission`)
				.send(originalProof);
			const updatedProof = {
				uploadRule6ProofOfEvidenceDocuments: true,
				rule6Witnesses: true,
				uploadRule6WitnessesEvidence: true
			};
			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/rule-6-proof-evidence-submission`)
				.send(updatedProof);
			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedProof,
				caseReference: testCaseRef,
				userId: validUser
			});
		});
	});
};
