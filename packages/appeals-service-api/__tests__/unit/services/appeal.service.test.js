const { getAppealByLPACodeAndId } = require('../../../src/services/appeal.service');
const { AppealsRepository } = require('../../../src/repositories/appeals-repository');
jest.mock('../../../src/repositories/sql/appeal-user-repository');
jest.mock('../../../src/repositories/sql/appeals-repository');

jest.mock('../../../src/repositories/sql/appeals-repository', () => ({
	AppealsRepository: class {
		createAppeal = Promise.resolve;
	}
}));

describe('./src/services/appeal.service', () => {
	it('should retrieve', async () => {
		const LPA_CODE = '9999';
		const ID = '0123456789';
		const spy = jest
			.spyOn(AppealsRepository.prototype, 'findOneByQuery')
			.mockResolvedValue({ appeal: {} });
		await getAppealByLPACodeAndId(LPA_CODE, ID);
		expect(spy).toHaveBeenCalledWith({ _id: ID, 'appeal.lpaCode': '9999' });
	});
});
