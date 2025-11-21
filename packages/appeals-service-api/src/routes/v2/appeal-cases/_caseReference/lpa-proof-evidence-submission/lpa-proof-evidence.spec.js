const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');

let validUser = '';
const validLpa = 'Q9999';
const invalidLpa = 'nope';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

	beforeAll(async () => {
		const user = await sqlClient.appealUser.create({
			data: {
				email: crypto.randomUUID() + '@example.com'
			}
		});
		validUser = user.id;
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

	describe('/appeal-cases/_caseReference/lpa-proof-evidence-submission', () => {
		it('should create a new lpa proof of evidence submission', async () => {
			const testCaseRef = '1234130';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaProofOfEvidenceData = {
				uploadLpaProofOfEvidenceDocuments: true,
				lpaWitnesses: false,
				uploadLpaWitnessesEvidence: false
			};
			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-proof-evidence-submission`)
				.send(lpaProofOfEvidenceData);
			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject(lpaProofOfEvidenceData);
		});
		it('should retrieve an existing lpa proof of evidence submission', async () => {
			const testCaseRef = '1234131';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaProofOfEvidenceData = {
				uploadLpaProofOfEvidenceDocuments: true,
				lpaWitnesses: false,
				uploadLpaWitnessesEvidence: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-proof-evidence-submission`)
				.send(lpaProofOfEvidenceData);
			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/lpa-proof-evidence-submission`
			);
			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...lpaProofOfEvidenceData,
				caseReference: testCaseRef
			});
		});
		it('should patch/update an existing lpa proof of evidence submission', async () => {
			const testCaseRef = '1234132';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const originalProof = {
				uploadLpaProofOfEvidenceDocuments: false,
				lpaWitnesses: true,
				uploadLpaWitnessesEvidence: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-proof-evidence-submission`)
				.send(originalProof);
			const updatedProof = {
				uploadLpaProofOfEvidenceDocuments: true,
				lpaWitnesses: true,
				uploadLpaWitnessesEvidence: true
			};
			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/lpa-proof-evidence-submission`)
				.send(updatedProof);
			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedProof,
				caseReference: testCaseRef
			});
		});
		it('should return 403 if invalid lpa user', async () => {
			const testCaseRef = '1234133';
			await createAppeal(testCaseRef);

			setCurrentLpa(invalidLpa);
			setCurrentSub(validUser);

			const lpaProofOfEvidenceData = {
				uploadLpaProofOfEvidenceDocuments: true,
				lpaWitnesses: false,
				uploadLpaWitnessesEvidence: false
			};

			const response = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-proof-evidence-submission`)
				.send(lpaProofOfEvidenceData);

			expect(response.status).toEqual(403);
			expect(response.body[0]).toEqual('forbidden');
		});
	});
};
