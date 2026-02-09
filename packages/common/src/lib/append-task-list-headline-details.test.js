const { APPEAL_USER_ROLES } = require('../constants');
const { appendTaskListHeadlineDetails } = require('./append-task-list-headline-details');

describe('Append TaskList Headline Details', () => {
	it('appends appeal type details and appellant name if present', () => {
		const testData = {
			appealTypeCode: 'test',
			users: [
				{
					firstName: 'Test FN',
					lastName: 'Test LN',
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					organisation: 'testOrganisation',
					serviceUserType: APPEAL_USER_ROLES.APPELLANT
				}
			]
		};

		appendTaskListHeadlineDetails(testData);

		expect(testData.appealTypeName).toEqual('');
		expect(testData.appellantFirstName).toEqual('Test FN');
		expect(testData.appellantLastName).toEqual('Test LN');
		expect(testData.detailsName).toEqual('Test FN Test LN');
	});

	it('appends appeal type details and appellant organisation if no name but organisation present', () => {
		const testData = {
			appealTypeCode: 'test',
			users: [
				{
					firstName: null,
					lastName: null,
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					organisation: 'testOrganisation',
					serviceUserType: APPEAL_USER_ROLES.APPELLANT
				}
			]
		};

		appendTaskListHeadlineDetails(testData);

		expect(testData.appealTypeName).toEqual('');
		expect(testData.appellantFirstName).toEqual(null);
		expect(testData.appellantLastName).toEqual(null);
		expect(testData.detailsName).toEqual('testOrganisation');
	});

	it('does not add appellant details if no appellant', () => {
		const testData = {
			appealTypeCode: 'test',
			users: [
				{
					firstName: null,
					lastName: null,
					emailAddress: 'test@example.com',
					telephoneNumber: '123456',
					organisation: 'testOrganisation',
					serviceUserType: APPEAL_USER_ROLES.AGENT
				}
			]
		};

		appendTaskListHeadlineDetails(testData);

		expect(testData.appealTypeName).toEqual('');
		expect(testData.appellantFirstName).toEqual(undefined);
		expect(testData.appellantLastName).toEqual(undefined);
		expect(testData.detailsName).toEqual(undefined);
	});
});
