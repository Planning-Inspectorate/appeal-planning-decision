const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('../constants');
const { formatApplicant } = require('./format-applicant');

describe('format-applicant', () => {
	describe('when not LPA user', () => {
		it('returns Applicant key and applicant name value with no contact details when valid ServiceUser attached to appeal', () => {
			const users = [
				{
					firstName: 'Firstname',
					lastName: 'Lastname',
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					serviceUserType: APPEAL_USER_ROLES.APPELLANT
				},
				{
					firstName: 'Invalid',
					lastName: 'Invalid',
					emailAddress: 'test2@example.com',
					telephoneNumber: '123450',
					serviceUserType: APPEAL_USER_ROLES.AGENT
				}
			];
			expect(formatApplicant(users)).toEqual({
				key: { text: 'Applicant' },
				value: { text: 'Firstname Lastname' }
			});
		});

		it('returns Applicant key and empty value if no valid ServiceUser attached to appeal', () => {
			const users = [
				{
					firstName: 'Firstname1',
					lastName: 'Lastname1',
					emailAddress: 'test3@example.com',
					telephoneNumber: '123457',
					serviceUserType: APPEAL_USER_ROLES.INTERESTED_PARTY
				},
				{
					firstName: 'Firstname2',
					lastName: 'Lastname2',
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					serviceUserType: APPEAL_USER_ROLES.AGENT
				}
			];
			expect(formatApplicant(users)).toEqual({ key: { text: 'Applicant' }, value: { text: '' } });
		});
	});

	describe('when LPA user', () => {
		it('returns Appellant key and appellant name value with contact details when no agent ServiceUser attached to appeal', () => {
			const users = [
				{
					firstName: 'Firstname1',
					lastName: 'Lastname1',
					serviceUserType: APPEAL_USER_ROLES.INTERESTED_PARTY
				},
				{
					firstName: 'Firstname2',
					lastName: 'Lastname2',
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					serviceUserType: APPEAL_USER_ROLES.APPELLANT
				}
			];
			expect(formatApplicant(users, LPA_USER_ROLE)).toEqual({
				key: { text: 'Appellant contact details' },
				value: { html: 'Firstname2 Lastname2<br>test@example.com<br>123456' }
			});
		});
		it('returns Agent key and agent name value with contact details when agent ServiceUser attached to appeal', () => {
			const users = [
				{
					firstName: 'Firstname1',
					lastName: 'Lastname1',
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					serviceUserType: APPEAL_USER_ROLES.INTERESTED_PARTY
				},
				{
					firstName: 'Firstname2',
					lastName: 'Lastname2',
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					serviceUserType: APPEAL_USER_ROLES.AGENT
				}
			];
			expect(formatApplicant(users, LPA_USER_ROLE)).toEqual({
				key: { text: 'Agent contact details' },
				value: { html: 'Firstname2 Lastname2<br>test@example.com<br>123456' }
			});
		});
		it('escapes user inputs when generating html value', () => {
			const users = [
				{
					firstName: "'<em>ily'",
					lastName: '<br>own',
					emailAddress: '"test@example.com',
					telephoneNumber: '&123456',
					serviceUserType: APPEAL_USER_ROLES.APPELLANT
				}
			];
			expect(formatApplicant(users, LPA_USER_ROLE)).toEqual({
				key: { text: 'Appellant contact details' },
				value: {
					html: '&#39;&lt;em&gt;ily&#39; &lt;br&gt;own<br>&quot;test@example.com<br>&amp;123456'
				}
			});
		});
		it('filters non-existant values when generating html value', () => {
			const users = [
				{
					firstName: 'fname',
					lastName: 'lname',
					emailAddress: 'test@example.com',
					serviceUserType: APPEAL_USER_ROLES.APPELLANT
				}
			];
			expect(formatApplicant(users, LPA_USER_ROLE)).toEqual({
				key: { text: 'Appellant contact details' },
				value: {
					html: 'fname lname<br>test@example.com'
				}
			});
		});
	});
});
