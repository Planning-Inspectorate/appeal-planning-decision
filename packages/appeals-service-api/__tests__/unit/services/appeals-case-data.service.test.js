const { getAppeals } = require('../../../src/services/appeals-case-data.service');

const mongodb = require('../../../src/db/db');
const ApiError = require('../../../src/errors/apiError');
const logger = require('../../../src/lib/logger');

jest.mock('../../../src/lib/logger');

describe('src/services/appeals-case-data.service.test', () => {
	// Mock MongoDB collection and methods
	const collectionMock = {
		//find: jest.fn(() => ({toArray: jest.fn()}))
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

	it('should fetch relevant appeals case data from db with specified LPA code', async () => {
		const lpaCode = 'Q9999';

		const appealsProjection = {
			projection: {
				caseReference: 1,
				LPAApplicationReference: 1,
				questionnaireDueDate: 1
			}
		};

		const appealCaseData = {
			_id: '89aa8504-773c-42be-bb68-029716ad9756',
			caseReference: '3221288',
			LPAApplicationReference: '2323232/pla',
			questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00'
		};

		collectionMock.find.mockResolvedValue({
			toArray: jest.fn(() => {
				return [appealCaseData];
			})
		});

		const result = await getAppeals(lpaCode);

		expect(collectionMock.find).toHaveBeenCalledWith(
			{
				LPACode: lpaCode,
				appealType: 'Householder (HAS) Appeal',
				validity: 'Valid',
				questionnaireDueDate: { $type: 'date' },
				questionnaireReceived: { $not: { $type: 'date' } }
			},
			appealsProjection
		);

		expect(result).toEqual([appealCaseData]);
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
});
