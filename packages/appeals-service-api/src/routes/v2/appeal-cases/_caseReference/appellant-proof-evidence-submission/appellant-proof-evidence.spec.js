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

	describe('/appeal-cases/_caseReference/appellant-proof-evidence-submission', () => {
		it('should create a new appellant proof of evidence submission', async () => {
			const testCaseRef = '1234127';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const appellantProofOfEvidenceData = {
				uploadAppellantProofOfEvidenceDocuments: true,
				appellantWitnesses: false,
				uploadAppellantWitnessesEvidence: false
			};
			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-proof-evidence-submission`)
				.send(appellantProofOfEvidenceData);
			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject(appellantProofOfEvidenceData);
		});
		it('should retrieve an existing appellant proof of evidence submission', async () => {
			const testCaseRef = '1234128';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const appellantProofOfEvidenceData = {
				uploadAppellantProofOfEvidenceDocuments: true,
				appellantWitnesses: false,
				uploadAppellantWitnessesEvidence: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-proof-evidence-submission`)
				.send(appellantProofOfEvidenceData);
			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/appellant-proof-evidence-submission`
			);
			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...appellantProofOfEvidenceData,
				caseReference: testCaseRef
			});
		});
		it('should patch/update an existing appellant proof of evidence submission', async () => {
			const testCaseRef = '1234129';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const originalProof = {
				uploadAppellantProofOfEvidenceDocuments: false,
				appellantWitnesses: true,
				uploadAppellantWitnessesEvidence: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-proof-evidence-submission`)
				.send(originalProof);
			const updatedProof = {
				uploadAppellantProofOfEvidenceDocuments: true,
				appellantWitnesses: true,
				uploadAppellantWitnessesEvidence: true
			};
			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/appellant-proof-evidence-submission`)
				.send(updatedProof);
			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedProof,
				caseReference: testCaseRef
			});
		});
	});
};
