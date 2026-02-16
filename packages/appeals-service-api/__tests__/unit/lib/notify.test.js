jest.mock('@pins/common/src/lib/notify/notify-builder', () => ({
	getNotifyClient: jest.fn(() => ({}))
}));

const mockPopulateTemplate = jest.fn(() => 'Mocked email content');
const mockSendEmail = jest.fn().mockResolvedValue({});
const MockNotifyService = jest.fn().mockImplementation(() => ({
	populateTemplate: mockPopulateTemplate,
	sendEmail: mockSendEmail
}));
MockNotifyService.templates = {
	lpaq: { v2LpaDashboardInvite: 'lpaq/v2-lpa-dashboard-invite-email.md' }
};
jest.mock('@pins/common/src/lib/notify/notify-service', () => MockNotifyService);
const {
	getSharedNotifyVariables,
	sendLPADashboardInviteEmail
} = require('../../../src/lib/notify');
const config = require('../../../src/configuration/config');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

describe('appeals-service-api/src/lib/notify.js', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('sendLPADashBoardInviteEmail', () => {
		it('should call notify service with correct values', async () => {
			const mockUser = {
				id: '123456',
				email: 'test@example.com',
				isAdmin: false,
				enabled: true,
				lpaCode: 'Q9999'
			};

			config.apps.appeals.baseUrl = 'mock-base-url';
			config.services.notify.baseUrl = 'mock-notify-base-url';
			config.services.notify.serviceId = 'mock-notify-service-id';
			config.services.notify.apiKey = 'mock-notify-api-key';
			config.services.notify.templates.generic = 'generic-template';

			const NotifyServiceMock = require('@pins/common/src/lib/notify/notify-service');

			await sendLPADashboardInviteEmail(mockUser);

			expect(NotifyServiceMock).toHaveBeenCalled();
			expect(mockPopulateTemplate).toHaveBeenCalledWith('lpaq/v2-lpa-dashboard-invite-email.md', {
				loginUrl: 'mock-base-url/manage-appeals/your-appeals',
				...config.services.notify.templateVariables
			});
			expect(mockSendEmail).toHaveBeenCalledWith({
				personalisation: {
					subject: `Create an account`,
					content: 'Mocked email content'
				},
				destinationEmail: 'test@example.com',
				templateId: 'generic-template',
				reference: '123456'
			});
		});
	});

	describe('getSharedNotifyVariables', () => {
		it('should return the expected shared variables when no options provided', () => {
			const expectedVariables = {
				...config.services.notify.templateVariables
			};

			const result = getSharedNotifyVariables();
			expect(result).toEqual(expectedVariables);
		});

		it('should return the expected shared variables when varyContactByEnforcement is false', () => {
			const expectedVariables = {
				...config.services.notify.templateVariables
			};

			const result = getSharedNotifyVariables({ varyContactByEnforcement: false });
			expect(result).toEqual(expectedVariables);
		});

		describe.each(Object.entries(CASE_TYPES))('%s case type', (caseTypeName, caseType) => {
			it(`should ${caseType.usesEnforcementContact ? 'use enforcement' : 'use regular'} contact email when varyContactByEnforcement is true`, () => {
				const expectedVariables = {
					...config.services.notify.templateVariables,
					...(caseType.usesEnforcementContact && {
						contactEmail: config.services.notify.templateVariables.contactEmailEnforcement
					})
				};

				const result = getSharedNotifyVariables({
					varyContactByEnforcement: true,
					appealTypeCode: caseType.processCode
				});

				expect(result).toEqual(expectedVariables);
			});

			it(`should use regular contact email when varyContactByEnforcement is false, regardless of case type`, () => {
				const expectedVariables = {
					...config.services.notify.templateVariables
				};

				const result = getSharedNotifyVariables({
					varyContactByEnforcement: false,
					appealTypeCode: caseType.processCode
				});

				expect(result).toEqual(expectedVariables);
			});
		});
	});
});
