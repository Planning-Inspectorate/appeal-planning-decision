const {
	getAppeals,
	postAppealCaseData
} = require('../../../src/services/appeals-case-data.service');
const AppealsCaseDataRepository = require('../../../src/repositories/appeals-case-data-repository');
const mongodb = require('../../../src/db/db');
const ApiError = require('../../../src/errors/apiError');
const logger = require('../../../src/lib/logger');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');

jest.mock('../../../src/lib/logger');

describe('src/services/appeals-case-data.service.test', () => {
	// Mock MongoDB collection and methods
	const collectionMock = {
		find: jest.fn()
	};

	beforeEach(() => {
		// Reset mock functions before each test
		jest.clearAllMocks();

		// Mock MongoDB connection and collection
		mongodb.get = jest.fn(() => ({
			collection: jest.fn(() => collectionMock)
		}));
	});

	it('should fetch and sort relevant appeals case data from db with specified LPA code', async () => {
		const lpaCode = 'Q9999';

		const appealsProjection = {
			projection: {
				caseReference: 1,
				LPAApplicationReference: 1,
				questionnaireDueDate: 1
			}
		};

		const appealCaseData = [
			{
				_id: '89aa8504-773c-42be-bb68-029716ad9756',
				LPACode: 'Q9999',
				validity: 'Valid',
				caseReference: '3221288',
				LPAApplicationReference: '2323232/pla',
				questionnaireDueDate: new Date('2023-07-07T13:53:31.6003126+00:00'),
				questionnaireReceived: ''
			},
			{
				_id: '90aa8504-773c-42be-bb68-029716ad9757',
				LPACode: 'Q9999',
				validity: 'Valid',
				caseReference: '3221289',
				LPAApplicationReference: '2323232/pla',
				questionnaireDueDate: new Date('2023-07-05T13:53:31.6003126+00:00'),
				questionnaireReceived: ''
			},
			{
				_id: '91aa8504-773c-42be-bb68-029716ad9758',
				LPACode: 'Q9999',
				validity: 'Valid',
				caseReference: '3221290',
				LPAApplicationReference: '2323232/pla',
				questionnaireDueDate: new Date('2023-07-06T13:53:31.6003126+00:00'),
				questionnaireReceived: ''
			}
		];

		collectionMock.find.mockResolvedValue({
			toArray: jest.fn(() => {
				return appealCaseData;
			})
		});

		const result = await getAppeals(lpaCode);

		expect(collectionMock.find).toHaveBeenCalledWith(
			{
				LPACode: lpaCode,
				appealType: APPEALS_CASE_DATA.APPEAL_TYPE.HAS,
				validity: APPEALS_CASE_DATA.VALIDITY.IS_VALID,
				questionnaireDueDate: { $type: 'date' },
				questionnaireReceived: { $not: { $type: 'date' } }
			},
			appealsProjection
		);

		expect(result[0].caseReference).toEqual('3221289');
		expect(result[1].caseReference).toEqual('3221290');
		expect(result[2].caseReference).toEqual('3221288');
	});

	it('should return a url friendly slug for appeal case ref', async () => {
		const lpaCode = 'Q9999';

		const appealCaseData = {
			_id: '89aa8504-773c-42be-bb68-029716ad9756',
			caseReference: '/@/1',
			LPAApplicationReference: '2323232/pla',
			questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00'
		};

		collectionMock.find.mockResolvedValue({
			toArray: jest.fn(() => {
				return [appealCaseData];
			})
		});

		const result = await getAppeals(lpaCode);

		expect(result[0].caseReferenceSlug).toEqual('%2F%40%2F1');
	});

	it('should throw error if no lpaCode provided', async () => {
		try {
			await getAppeals();
		} catch (err) {
			expect(err).toEqual(ApiError.noLpaCodeProvided());
		}
	});

	it('should log and throw error if db call fails', async () => {
		const lpaCode = 'ABC123';
		const error = new Error('database error');
		collectionMock.find.mockRejectedValue(error);

		try {
			await getAppeals(lpaCode);
		} catch (err) {
			expect(err).toEqual(ApiError.appealsCaseDataNotFound());
			expect(logger.error).toHaveBeenCalledWith(error);
		}
	});
	it('should create a case', async () => {
		const spy = jest
			.spyOn(AppealsCaseDataRepository.prototype, 'postAppealCaseData')
			.mockImplementation(() => {});
		const aCase = {
			id: 1
		};
		await postAppealCaseData(aCase);
		expect(spy).toHaveBeenCalledWith(aCase);
	});
});
