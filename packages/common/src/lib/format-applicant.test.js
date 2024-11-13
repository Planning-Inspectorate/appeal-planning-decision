const { APPEAL_USER_ROLES } = require('../constants');
const { formatApplicant } = require('./format-applicant');

describe('format-applicant', () => {
	it('formats applicant name when provided with valid user', () => {
		const users = [
			{
				firstName: 'Firstname',
				lastName: 'Lastname',
				serviceUserType: APPEAL_USER_ROLES.APPELLANT
			},
			{ firstName: 'Invalid', lastName: 'Invalid', serviceUserType: APPEAL_USER_ROLES.AGENT }
		];
		expect(formatApplicant(users)).toEqual('Firstname Lastname');
	});

	it('returns empty string if no valid user provided', () => {
		const users = [
			{
				firstName: 'Firstname1',
				lastName: 'Lastname1',
				serviceUserType: APPEAL_USER_ROLES.INTERESTED_PARTY
			},
			{ firstName: 'Firstname2', lastName: 'Lastname2', serviceUserType: APPEAL_USER_ROLES.AGENT }
		];
		expect(formatApplicant(users)).toEqual('');
	});
});
