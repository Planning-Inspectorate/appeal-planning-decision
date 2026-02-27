const { APPEAL_CASE_TYPE } = require('@planning-inspectorate/data-model');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { linkUserToAppeal } = require('../../routes/v2/users/service');
const { createAppeal } = require('../../routes/v2/appeals/service');

jest.mock('../../routes/v2/users/service');
jest.mock('../../routes/v2/appeals/service');

const { createEnforcementNamedIndividualAppeals } = require('./utils');

describe('utils.js', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('createEnforcementNamedIndividualAppeals', () => {
		it('should create an appeal for each named individual and link to a user', async () => {
			createAppeal.mockResolvedValue({ id: 'testId' });

			const mappedData = {
				casedata: {
					caseType: APPEAL_CASE_TYPE.C,
					submissionId: 'testSubmissionId',
					namedIndividuals: [
						{
							id: 'test1'
						},
						{
							id: 'test2'
						}
					]
				}
			};

			const userId = 'testUserId';

			await createEnforcementNamedIndividualAppeals(mappedData, userId);

			expect(createAppeal).toHaveBeenCalledTimes(2);
			expect(createAppeal).toHaveBeenCalledWith({
				leadAppellantSubmissionId: mappedData.casedata.submissionId
			});
			expect(linkUserToAppeal).toHaveBeenCalledTimes(2);
			expect(linkUserToAppeal).toHaveBeenCalledWith(userId, 'testId', APPEAL_USER_ROLES.AGENT);
		});

		it('should not create an appeal or user link if not an enforcement case', async () => {
			const mappedData = {
				casedata: {}
			};

			const userId = 'testUserId';

			await createEnforcementNamedIndividualAppeals(mappedData, userId);

			expect(createAppeal).not.toHaveBeenCalled();
			expect(linkUserToAppeal).not.toHaveBeenCalled();

			const mappedDataNotEnforcement = {
				casedata: { caseType: 'not enforcement' }
			};

			await createEnforcementNamedIndividualAppeals(mappedDataNotEnforcement, userId);

			expect(createAppeal).not.toHaveBeenCalled();
			expect(linkUserToAppeal).not.toHaveBeenCalled();
		});

		it('should not create an appeal or user link if enforcement with no named individuals', async () => {
			const mappedData = {
				casedata: {
					caseType: APPEAL_CASE_TYPE.C,
					submissionId: 'testSubmissionId',
					namedIndividuals: []
				}
			};

			const userId = 'testUserId';

			await createEnforcementNamedIndividualAppeals(mappedData, userId);

			expect(createAppeal).not.toHaveBeenCalled();
			expect(linkUserToAppeal).not.toHaveBeenCalled();
		});
	});
});
