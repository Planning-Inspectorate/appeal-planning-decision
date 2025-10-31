// We assume the functions to test are in './email.service.js'
// We also assume dependencies are in paths like './config', './logger', etc.

// Import the function to test
// Note: We import it *after* setting up mocks
let sendLPADashboardInviteEmail;

// Mock external dependencies
jest.mock('../../../src/configuration/config', () => ({
	config: {
		services: {
			notify: {
				templateVariables: { 'lpa-name': 'Test LPA Name' },
				baseUrl: 'http://notify.test',
				serviceId: 'service-id-123',
				apiKey: 'api-key-123'
			}
		},
		apps: {
			appeals: {
				baseUrl: 'http://appeals.test'
			}
		}
	},
	templates: {
		generic: 'generic-template-id-456'
	}
}));

jest.mock('../../../src/lib/logger', () => ({
	logger: {
		debug: jest.fn(),
		error: jest.fn()
	}
}));

jest.mock('@pins/common/src/lib/notify/notify-builder', () => ({
	NotifyBuilder: {
		getNotifyClient: jest.fn().mockReturnValue({
			/* mock client object */
		})
	}
}));

// Mock NotifyService and capture its mock methods for inspection
const mockPopulateTemplate = jest.fn();
const mockSendEmail = jest.fn();

jest.mock(
	'@pins/common/src/lib/notify/notify-service',
	() => {
		// Mock the NotifyService class constructor
		const mockNotifyService = jest.fn().mockImplementation(() => {
			return {
				populateTemplate: mockPopulateTemplate,
				sendEmail: mockSendEmail
			};
		});

		// Mock the static properties on the class
		// @ts-ignore
		mockNotifyService.templates = {
			lpaq: {
				v2LpaDashboardInvite: 'lpa-invite-template-id-789'
			}
		};

		return { NotifyService: mockNotifyService };
	},
	{ virtual: true }
);

// Import the logger to check its calls
// @ts-ignore
const { logger } = require('../../../src/lib/logger');

describe('sendLPADashboardInviteEmail', () => {
	// @ts-ignore
	let testUser;

	beforeEach(() => {
		// Reset all mock function call counters before each test
		jest.clearAllMocks();

		// Reset the module-level singleton instance by resetting modules.
		// This ensures getNotifyService() re-creates the service
		// (which will be our mock) for each test.
		jest.resetModules();

		// Re-import the functions under test *after* resetting modules
		// const emailService = require('./email.service');
		// sendLPADashboardInviteEmail = emailService.sendLPADashboardInviteEmail;
		// getNotifyService = emailService.getNotifyService;

		sendLPADashboardInviteEmail = require('../../../src/lib/notify').sendLPADashboardInviteEmail;

		// Set up a standard test user
		testUser = {
			id: '123456',
			email: 'test@example.com',
			isAdmin: false,
			enabled: true,
			lpaCode: 'LPA-CODE-XYZ'
		};

		// Set up default successful mock implementations
		mockPopulateTemplate.mockReturnValue('Mocked email content');
		mockSendEmail.mockResolvedValue({ status: 200, data: 'Email sent' });
	});

	it('should send an invitation email successfully with correct details', async () => {
		// @ts-ignore
		await sendLPADashboardInviteEmail(testUser);

		// 1. Check that the createAccountUrl was built correctly
		const expectedUrl = 'http://appeals.test/manage-appeals/service-invite/LPA-CODE-XYZ';
		const expectedVariables = {
			createAccountUrl: expectedUrl,
			contactEmail: 'caseofficers@planninginspectorate.gov.uk',
			contactForm: 'https://contact-us.planninginspectorate.gov.uk/hc/en-gb/requests/new',
			feedbackUrl:
				'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UOUlNRkhaQjNXTDQyNEhSRExNOFVGSkNJTS4u&route=shorturl'
		};

		// 2. Check that the debug logger was called with the right info
		expect(logger.debug).toHaveBeenCalledWith(
			{
				recipientEmail: 'test.user@example.com',
				variables: expectedVariables,
				reference: 'user-id-abc'
			},
			'Sending LPA dashboard invitation email'
		);

		// 3. Check that the template was populated correctly
		expect(mockPopulateTemplate).toHaveBeenCalledWith(
			'lpa-invite-template-id-789', // From NotifyService.templates.lpaq.v2LpaDashboardInvite
			expectedVariables
		);

		// 4. Check that the email was sent with the correct parameters
		expect(mockSendEmail).toHaveBeenCalledWith({
			personalisation: {
				subject: `Create an account`,
				content: 'Mocked email content' // From mockPopulateTemplate
			},
			destinationEmail: 'test.user@example.com',
			templateId: 'generic-template-id-456', // From templates.generic
			reference: 'user-id-abc'
		});

		// 5. Ensure no errors were logged
		expect(logger.error).not.toHaveBeenCalled();
	});

	// it('should use user.email as reference if user.id is missing', async () => {
	//   const userNoId = {
	//     email: 'no-id-user@example.com',
	//     lpaCode: 'LPA-NO-ID',
	//   };

	//   await sendLPADashboardInviteEmail(userNoId);

	//   const expectedReference = 'no-id-user@example.com';

	//   // Check that reference in debug log is correct
	//   expect(logger.debug).toHaveBeenCalledWith(
	//     expect.objectContaining({
	//       reference: expectedReference,
	//     }),
	//     expect.anything()
	//   );

	//   // Check that reference in sendEmail call is correct
	//   expect(mockSendEmail).toHaveBeenCalledWith(
	//     expect.objectContaining({
	//       reference: expectedReference,
	//     })
	//   );
	// });

	// it('should log an error if populateTemplate throws an error', async () => {
	//   const templateError = new Error('Failed to populate template');
	//   mockPopulateTemplate.mockImplementation(() => {
	//     throw templateError;
	//   });

	//   // @ts-ignore
	//   await sendLPADashboardInviteEmail(testUser);

	//   // 1. Check that the error was logged correctly
	//   expect(logger.error).toHaveBeenCalledWith(
	//     // @ts-ignore
	//     { err: templateError, userId: testUser.id },
	//     'Unable to send LPA dashboard invitation email'
	//   );

	//   // 2. Ensure sendEmail was NOT called
	//   expect(mockSendEmail).not.toHaveBeenCalled();
	// });

	// it('should log an error if sendEmail rejects', async () => {
	//   const sendError = new Error('Notify API failed');
	//   mockSendEmail.mockRejectedValue(sendError);

	//   // @ts-ignore
	//   await sendLPADashboardInviteEmail(testUser);

	//   // 1. Check that the error was logged correctly
	//   expect(logger.error).toHaveBeenCalledWith(
	//     // @ts-ignore
	//     { err: sendError, userId: testUser.id },
	//     'Unable to send LPA dashboard invitation email'
	//   );
	// });
});
