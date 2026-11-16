const { putCase } = require('../../../../../src/routes/v2/appeal-cases/service');
const { AppealCaseRepository } = require('../../../../../src/routes/v2/appeal-cases/repo');
const {
	exampleGroupCDataModel
} = require('../../../../developer/fixtures/appeals-group-c-data-model');
const { GROUP_C_PROCESS_CODES } = require('@pins/common/src/database/data-static');
const ApiError = require('#errors/apiError');

jest.mock('#db-client', () => ({
	createPrismaClient: () => ({})
}));
jest.mock('#repositories/sql/service-user-repository');
jest.mock('#lib/notify');

describe('Group C Generic Appeals Ingestion', () => {
	let putByCaseReferenceSpy;
	let putRelationsSpy;

	beforeEach(() => {
		jest.clearAllMocks();
		putByCaseReferenceSpy = jest
			.spyOn(AppealCaseRepository.prototype, 'putByCaseReference')
			.mockResolvedValue({
				appealCase: { caseReference: '6001474' },
				exists: true
			});
		putRelationsSpy = jest
			.spyOn(AppealCaseRepository.prototype, 'putRelationsByCaseReference')
			.mockResolvedValue({});
	});

	afterEach(() => {
		putByCaseReferenceSpy.mockRestore();
		putRelationsSpy.mockRestore();
	});

	it.each(['G', 'L', 'Q', 'TPO', 'TRN', 'HH', 'HR', 'ENV'])(
		'should successfully validate and map Group C caseType %s',
		async (caseType) => {
			const payload = {
				...exampleGroupCDataModel,
				caseType
			};

			const result = await putCase(payload.caseReference, payload);

			expect(putByCaseReferenceSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					caseReference: payload.caseReference,
					mappedData: expect.objectContaining({
						caseReference: payload.caseReference,
						CaseType: { connect: { processCode: caseType } },
						CaseStatus: { connect: { key: payload.caseStatus } },
						CaseDecisionOutcome: { connect: { key: payload.caseDecisionOutcome } },
						LPACode: payload.lpaCode,
						caseCompletedDate: payload.caseCompletedDate,
						caseDecisionOutcomeDate: payload.caseDecisionOutcomeDate
					})
				})
			);
			expect(result).toEqual({ caseReference: '6001474' });
		}
	);

	it('should ignore submissionId for Group C appeals', async () => {
		const payload = {
			...exampleGroupCDataModel,
			submissionId: 'ebb7411a-9cc3-45ce-9de3-423094f2fcb7'
		};

		await putCase(payload.caseReference, payload);

		expect(putByCaseReferenceSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				submissionId: null
			})
		);
	});

	it('should fallback LPACode to UNASSIGNED when lpaCode is null', async () => {
		const payload = {
			...exampleGroupCDataModel,
			lpaCode: null
		};

		await putCase(payload.caseReference, payload);

		expect(putByCaseReferenceSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				mappedData: expect.objectContaining({
					LPACode: 'UNASSIGNED'
				})
			})
		);
	});

	it('should reject invalid Group C payload with 400 Bad Request', async () => {
		const invalidPayload = {
			...exampleGroupCDataModel,
			caseReference: 'invalid-ref' // must match ^6\d{6}$
		};

		let thrownError;
		try {
			await putCase(invalidPayload.caseReference, invalidPayload);
		} catch (err) {
			thrownError = err;
		}

		expect(thrownError).toBeInstanceOf(ApiError);
		expect(thrownError.code).toBe(400);
		expect(putByCaseReferenceSpy).not.toHaveBeenCalled();
	});

	describe('LPA Dashboard Exclusion', () => {
		it('should include Group C process code exclusion in listByLpaCode query', async () => {
			const repo = new AppealCaseRepository();
			const mockFindMany = jest.fn().mockResolvedValue([]);
			repo.dbClient = {
				appealCase: {
					findMany: mockFindMany
				}
			};

			await repo.listByLpaCode({ lpaCode: 'Q9999', decidedOnly: true });

			expect(mockFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						AND: expect.arrayContaining([
							{ LPACode: 'Q9999' },
							{ appealTypeCode: { notIn: GROUP_C_PROCESS_CODES } }
						])
					}
				})
			);
		});

		it('should include Group C process code exclusion in countByLpaCode query', async () => {
			const repo = new AppealCaseRepository();
			const mockCount = jest.fn().mockResolvedValue(0);
			repo.dbClient = {
				appealCase: {
					count: mockCount
				}
			};

			await repo.countByLpaCode({ lpaCode: 'Q9999', decidedOnly: true });

			expect(mockCount).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						AND: expect.arrayContaining([
							{ LPACode: 'Q9999' },
							{ appealTypeCode: { notIn: GROUP_C_PROCESS_CODES } }
						])
					}
				})
			);
		});

		it('should create new Appeal if submissionId does not exist in database', async () => {
			putByCaseReferenceSpy.mockRestore();
			const repo = new AppealCaseRepository();
			const mockFindFirst = jest.fn().mockResolvedValue(null);
			const mockCreate = jest.fn().mockResolvedValue({ id: 'case-1' });
			repo.dbClient = {
				appealCase: {
					count: jest.fn().mockResolvedValue(0),
					create: mockCreate
				},
				appellantSubmission: {
					findFirst: jest.fn().mockResolvedValue(null)
				},
				appeal: {
					findFirst: mockFindFirst
				}
			};

			await repo.putByCaseReference({
				caseReference: '6000157',
				submissionId: 'unknown-uuid',
				mappedData: { caseReference: '6000157' }
			});

			expect(mockCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						Appeal: { create: {} }
					})
				})
			);
		});
	});
});
