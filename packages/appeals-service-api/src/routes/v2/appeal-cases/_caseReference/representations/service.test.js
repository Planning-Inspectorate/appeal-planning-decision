jest.mock('../../../service-users/service');
const { getServiceUsersWithEmailsByIdAndCaseReference } = require('../../../service-users/service');
const { REPRESENTATION_TYPES } = require('@pins/common/src/constants');

const { getServiceUsersWithEmails } = require('./service');

describe('representations service', () => {
	describe('getServiceUsersWithEmails', () => {
		it('should map all reps that are not IP comments', async () => {
			await getServiceUsersWithEmails('caseRef', [
				{
					serviceUserId: '123',
					representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
				},
				{
					representationType: 'NO_SERVICE_USER_ID'
				},
				{
					serviceUserId: '456',
					representationType: 'ANYTHING_ELSE'
				}
			]);
			expect(getServiceUsersWithEmailsByIdAndCaseReference).toHaveBeenCalledWith(
				['456'],
				'caseRef'
			);
		});
	});
});
