const {
	findListedBuilding,
	updateListedBuildings
} = require('../../../src/services/listed-building.service');
const ListedBuildingRepository = require('../../../src/repositories/listed-building-repository');
const ApiError = require('../../../src/errors/apiError');

const mockLB = {
	reference: '123',
	name: 'abc',
	listedBuildingGrade: 'I'
};

describe('./src/services/listed-building.service', () => {
	let updateListedBuildingsSpy, getListedBuildingSpy;

	beforeEach(() => {
		updateListedBuildingsSpy = jest.spyOn(
			ListedBuildingRepository.prototype,
			'updateListedBuildings'
		);
		getListedBuildingSpy = jest.spyOn(ListedBuildingRepository.prototype, 'getListedBuilding');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('updateListedBuildings', () => {
		it('validates and calls repository', async () => {
			updateListedBuildingsSpy.mockResolvedValue({});
			const data = [mockLB, { ...mockLB, otherData: 1 }];
			await updateListedBuildings(data);
			expect(updateListedBuildingsSpy).toHaveBeenCalledWith(data);
		});

		it('throws bad request error if bad data sent through in one of the updates', async () => {
			try {
				await updateListedBuildings([mockLB, {}]);
			} catch (err) {
				expect(err).toEqual(ApiError.badRequest());
			}

			expect(updateListedBuildingsSpy).not.toHaveBeenCalled();
		});

		it('throws bad request error if no data sent through', async () => {
			try {
				await updateListedBuildings();
			} catch (err) {
				expect(err).toEqual(ApiError.badRequest());
			}

			expect(updateListedBuildingsSpy).not.toHaveBeenCalled();
		});

		it('throws error if call to repo unsuccessful', async () => {
			const error = new Error('database error');
			updateListedBuildingsSpy.mockRejectedValue(error);

			await expect(updateListedBuildings([mockLB])).rejects.toThrow('database error');
			expect(updateListedBuildingsSpy).toHaveBeenCalledWith([mockLB]);
		});
	});

	describe('getListedBuilding', () => {
		it('calls repository with ref', async () => {
			const expectedResult = { a: 1 };
			getListedBuildingSpy.mockResolvedValue(expectedResult);

			const ref = 'ref';
			const result = await findListedBuilding(ref);

			expect(getListedBuildingSpy).toHaveBeenCalledWith(ref);
			expect(result).toEqual(expectedResult);
		});

		it('throws error if call to repo unsuccessful', async () => {
			const error = new Error('database error');
			getListedBuildingSpy.mockRejectedValue(error);

			const ref = 'ref';
			await expect(findListedBuilding(ref)).rejects.toThrow('database error');
			expect(getListedBuildingSpy).toHaveBeenCalledWith(ref);
		});
	});
});
