const { getAppealByLPACodeAndId } = require('../../../src/services/appeal.service');
// eslint-disable-next-line no-unused-vars
const { AppealsRepository } = require('../../../src/repositories/appeals-repository');

describe('./src/services/appeal.service', () => {
	it('should retrieve', async () => {
		const LPA_CODE = '9999';
		const ID = '0123456789';
		const spy = jest
			.spyOn(AppealsRepository.prototype, 'findOneByQuery')
			.mockResolvedValue({ appeal: {} });
		await getAppealByLPACodeAndId(LPA_CODE, ID);
		expect(spy).toHaveBeenCalledWith({ _id: ID, lpaCode: LPA_CODE });
	});
});
