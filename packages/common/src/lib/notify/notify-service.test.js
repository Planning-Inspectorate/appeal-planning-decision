const NotifyService = require('./notify-service');
const fs = require('fs');
const path = require('path');
const notifyClientMock = jest.fn().mockImplementation(() => ({
	sendEmail: jest.fn()
}));
const loggerMock = jest.fn().mockImplementation(() => ({
	info: jest.fn(),
	debug: jest.fn(),
	error: jest.fn()
}));
const escape = require('escape-html');

describe('NotifyService', () => {
	let notifyService;
	let notifyClient = notifyClientMock();
	let logger = loggerMock();

	beforeEach(() => {
		jest.clearAllMocks();
		notifyService = new NotifyService({ notifyClient, logger });
	});

	describe('sendEmail', () => {
		it('should log and send an email', async () => {
			notifyClient.sendEmail.mockResolvedValue({});
			logger.info.mockClear();
			logger.debug.mockClear();

			await notifyService.sendEmail({
				destinationEmail: 'test@example.com',
				templateId: 'template-id',
				reference: 'reference',
				personalisation: { name: 'John' },
				emailReplyToId: 'reply-to-id'
			});

			expect(logger.info).toHaveBeenCalledWith('Sending template-id via notify ref reference');
			expect(logger.debug).toHaveBeenCalledWith({
				destinationEmail: 'test@example.com',
				templateId: 'template-id',
				personalisation: { name: 'John' },
				emailReplyToId: 'reply-to-id',
				reference: 'reference'
			});
			expect(notifyClient.sendEmail).toHaveBeenCalledWith('template-id', 'test@example.com', {
				personalisation: { name: 'John' },
				reference: 'reference',
				emailReplyToId: 'reply-to-id'
			});
		});

		it('should throw an error if templateId is missing', async () => {
			await expect(
				notifyService.sendEmail({
					destinationEmail: 'test@example.com',
					reference: 'reference'
				})
			).rejects.toThrow('Template ID must be set before an email can be sent.');
		});

		it('should throw an error if destinationEmail is missing', async () => {
			await expect(
				notifyService.sendEmail({
					templateId: 'template-id',
					reference: 'reference'
				})
			).rejects.toThrow('A destination email address must be set before an email can be sent.');
		});

		it('should throw an error if reference is missing', async () => {
			await expect(
				notifyService.sendEmail({
					destinationEmail: 'test@example.com',
					templateId: 'template-id'
				})
			).rejects.toThrow('A reference must be set before an email can be sent.');
		});

		it('should log and throw an error if sendEmail fails', async () => {
			const error = new Error('sendEmail failed');
			notifyClient.sendEmail.mockRejectedValue(error);
			logger.error.mockClear();

			await expect(
				notifyService.sendEmail({
					destinationEmail: 'test@example.com',
					templateId: 'template-id',
					reference: 'reference'
				})
			).rejects.toThrow('sendEmail failed');

			expect(logger.error).toHaveBeenCalledWith({ err: error }, 'Problem sending email');
		});
	});

	describe('templates', () => {
		it('should verify all templates exist', () => {
			const templates = NotifyService.templates;
			const templateNames = Object.values(templates).flatMap(Object.values);

			templateNames.forEach((templateName) => {
				const templatePath = path.join(__dirname, 'templates', `${templateName}`);
				expect(() => fs.readFileSync(templatePath, { encoding: 'utf8' })).not.toThrow();
			});
		});

		it('should find missing params for each template', () => {
			const templates = NotifyService.templates;
			const templateNames = Object.values(templates).flatMap(Object.values);

			templateNames.forEach((templateName) => {
				expect(() => notifyService.populateTemplate(templateName, {})).toThrow(
					new RegExp(
						`^populateTemplate error: missing parameter at line #\\d+ and column #\\d+ in template: ${templateName}`
					)
				);
			});
		});

		it('should error for missing template', () => {
			expect(() => notifyService.populateTemplate('nope.njk', {})).toThrow(
				'populateTemplate error: template not found: nope.njk'
			);
		});

		const whiteSpaceReplace = /\s+/g;
		const expectMessage = (result, expected) => {
			expect(result.replace(whiteSpaceReplace, ' ')).toEqual(
				expected.replace(whiteSpaceReplace, ' ')
			);
		};

		it('should escape html', () => {
			const template = NotifyService.templates.appealSubmission.v1Initial;
			const personalisation = { name: '<script>alert(1)</script>', contactEmail: '<tag>' };
			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`We have received your appeal.

			We will process your appeal and send a confirmation email. This will include:

			* your appeal reference number
			* a copy of your appeal form

			Planning Inspectorate
			${escape(personalisation.contactEmail)}`
			);
		});

		it('should populate appealSubmission.v1SaveAndReturnContinueAppeal ', () => {
			const template = NotifyService.templates.appealSubmission.v1SaveAndReturnContinueAppeal;
			const personalisation = {
				date: '30 April 2025',
				link: 'this/is/the/link',
				contactEmail: 'test email address'
			};

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`We’ve saved your appeal. You have until ${personalisation.date} to submit the appeal.

				Sign in to view your appeals and continue: ${personalisation.link}

				Planning Inspectorate
				${personalisation.contactEmail}`
			);
		});

		it('should populate appealSubmission.v1Initial ', () => {
			const template = NotifyService.templates.appealSubmission.v1Initial;
			const personalisation = { name: 'test-name', contactEmail: 'test email address' };

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`We have received your appeal.

			We will process your appeal and send a confirmation email. This will include:

			* your appeal reference number
			* a copy of your appeal form

			Planning Inspectorate
			${personalisation.contactEmail}`
			);
		});

		it('should populate appealSubmission.v1FollowUp ', () => {
			const template = NotifyService.templates.appealSubmission.v1FollowUp;
			const personalisation = {
				appealReferenceNumber: 'abc',
				appealSiteAddress: 'd\ne\nf',
				lpaReference: 'ghi',
				pdfLink: 'test.pdf',
				lpaName: 'System Test',
				feedbackUrl: 'https://example.com/feedback',
				contactEmail: 'test email address'
			};

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`We have processed your appeal.

				# Appeal details
				^ Appeal reference number: ${personalisation.appealReferenceNumber}
				Address: ${personalisation.appealSiteAddress}
				Planning application reference: ${personalisation.lpaReference}

				# What happens next
				1. Download a copy of your appeal form ${personalisation.pdfLink}.
				2. [Find the email address for your local planning authority.](https://www.gov.uk/government/publications/sending-a-copy-of-the-appeal-form-to-the-council/sending-a-copy-to-the-council)
				3. Email the copy of your appeal form and the documents you uploaded to: ${personalisation.lpaName}.
				4. We will check and confirm that your appeal form has everything that we need.

				You must send a copy of your appeal form and documents to the local planning authority, it’s a legal requirement.

				# Give feedback
				[Give feedback on the appeals service](${personalisation.feedbackUrl}) (takes 2 minutes)

				Planning Inspectorate
				${personalisation.contactEmail}`
			);
		});

		it('should populate appealSubmission.v1LPANotification', () => {
			const template = NotifyService.templates.appealSubmission.v1LPANotification;
			const personalisation = {
				lpaName: 'Test LPA',
				appealType: 'householder planning',
				applicationDecision: 'the refusal of',
				lpaReference: 'abc',
				appealReferenceNumber: 'horizonRef',
				appealSiteAddress: 'a\nb\nc',
				submissionDate: '10 April 2025',
				contactEmail: 'test email address'
			};

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`We have received a ${personalisation.appealType} appeal against ${personalisation.applicationDecision} planning application ${personalisation.lpaReference}.

				# Appeal details
				^ Appeal reference number: ${personalisation.appealReferenceNumber}
				Address: ${personalisation.appealSiteAddress}
				Planning application reference: ${personalisation.lpaReference}
				Submitted date: ${personalisation.submissionDate}

				# What happens next
				The appellant will send you a copy of their appeal. If you do not receive this, contact the appellant to request it.

				We will contact you again when we start the appeal.

				Planning Inspectorate
				${personalisation.contactEmail}`
			);
		});

		describe('should populate appealSubmission.v2Initial ', () => {
			it('should populate for non-enforcement appeals', () => {
				const template = NotifyService.templates.appealSubmission.v2Initial;
				const personalisation = {
					appealSiteAddress: 'a\nb\nc',
					lpaReference: 'lpa-ref',
					enforcementReference: '',
					isEnforcement: false,
					feedbackUrl: 'https://example.com',
					contactEmail: 'contact email'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your appeal.

					# Appeal details
					^ Address: ${personalisation.appealSiteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next
					We will process your appeal and send a confirmation email. This will include your appeal reference number.

					# Give feedback
					[Give feedback on the appeals service](${personalisation.feedbackUrl}) (takes 2 minutes)

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('should populate for enforcement appeals', () => {
				const template = NotifyService.templates.appealSubmission.v2Initial;
				const personalisation = {
					appealSiteAddress: 'a\nb\nc',
					lpaReference: 'lpa-ref',
					enforcementReference: 'enforcement-ref',
					isEnforcement: true,
					feedbackUrl: 'https://example.com',
					contactEmail: 'contact email'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your appeal.

					# Appeal details
					^ Address: ${personalisation.appealSiteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next
					We will process your appeal and send a confirmation email. This will include your appeal reference number.

					# Give feedback
					[Give feedback on the appeals service](${personalisation.feedbackUrl}) (takes 2 minutes)

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		describe('should populate appealSubmission.v2FollowUp ', () => {
			it('should populate for non-enforcement appeals', () => {
				const template = NotifyService.templates.appealSubmission.v2FollowUp;
				const personalisation = {
					appealReferenceNumber: 'abc',
					appealSiteAddress: 'd\ne\nf',
					lpaReference: 'ghi',
					enforcementReference: '',
					isEnforcement: false,
					pdfLink: 'test.pdf',
					feedbackUrl: 'https://example.com/feedback',
					contactForm: 'https://example.com/contact'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have processed your appeal.

					# Appeal details
					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next

					1. Download a copy of your appeal form ${personalisation.pdfLink}.
					2. [Find the email address for your local planning authority.](https://www.gov.uk/government/publications/sending-a-copy-of-the-appeal-form-to-the-council/sending-a-copy-to-the-council)
					3. Email the copy of your appeal form and the documents you uploaded to your local planning authority.
					4. We will check and confirm that your appeal form has everything that we need.

					You must send a copy of your appeal form and documents to the local planning authority, it’s a legal requirement.

					# Give feedback
					[Give feedback on the appeals service](${personalisation.feedbackUrl}) (takes 2 minutes)

					Planning Inspectorate
					[Contact us](${personalisation.contactForm})`
				);
			});

			it('should populate for enforcement appeals', () => {
				const template = NotifyService.templates.appealSubmission.v2FollowUp;
				const personalisation = {
					appealReferenceNumber: 'abc',
					appealSiteAddress: 'd\ne\nf',
					lpaReference: 'ghi',
					enforcementReference: 'enforcement-ref',
					isEnforcement: true,
					pdfLink: 'test.pdf',
					feedbackUrl: 'https://example.com/feedback',
					contactForm: 'https://example.com/contact'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have processed your appeal.

					# Appeal details
					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next

					1. Download a copy of your appeal form ${personalisation.pdfLink}.
					2. [Find the email address for your local planning authority.](https://www.gov.uk/government/publications/sending-a-copy-of-the-appeal-form-to-the-council/sending-a-copy-to-the-council)
					3. Email the copy of your appeal form and the documents you uploaded to your local planning authority.
					4. We will check and confirm that your appeal form has everything that we need.

					You must send a copy of your appeal form and documents to the local planning authority, it’s a legal requirement.

					# Give feedback
					[Give feedback on the appeals service](${personalisation.feedbackUrl}) (takes 2 minutes)

					Planning Inspectorate
					[Contact us](${personalisation.contactForm})`
				);
			});
		});

		describe('should populate appealSubmission.v2LPANotification', () => {
			it('populates for non-enforcement appeals', () => {
				const template = NotifyService.templates.appealSubmission.v2LPANotification;
				const personalisation = {
					appealReferenceNumber: '6000000',
					appealSiteAddress: 'Address\nLine 2\nLine 3',
					appealType: 'an advertisement',
					applicationDecision: 'the refusal of',
					isEnforcement: false,
					loginUrl: 'https://example.com/login',
					lpaReference: 'abc',
					referenceType: 'planning application reference',
					submissionDate: '17 March 2026',
					contactEmailLPA: 'test email address'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received an advertisement appeal against the refusal of planning application reference ${personalisation.lpaReference}.

					# Appeal details
					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress} 
					Planning application reference: ${personalisation.lpaReference}
					Submitted date: ${personalisation.submissionDate}

					When we start the appeal, you can [view the appeal in the manage your appeals service](${personalisation.loginUrl}). We will contact you when we start the appeal.

					Planning Inspectorate
					${personalisation.contactEmailLPA}`
				);
			});

			it('populates for enforcement appeals', () => {
				const template = NotifyService.templates.appealSubmission.v2LPANotification;
				const personalisation = {
					appealReferenceNumber: '6000000',
					appealSiteAddress: 'Address\nLine 2\nLine 3',
					appealType: 'an enforcement listed building and conservation area',
					applicationDecision: '',
					isEnforcement: true,
					loginUrl: 'https://example.com/login',
					lpaReference: 'abc',
					referenceType: 'enforcement reference',
					submissionDate: '17 March 2026',
					contactEmailLPA: 'test email address'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received an enforcement listed building and conservation area appeal against enforcement reference ${personalisation.lpaReference}.

					# Appeal details
					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress} 
					Enforcement reference: ${personalisation.lpaReference}
					Submitted date: ${personalisation.submissionDate}

					When we start the appeal, you can [view the appeal in the manage your appeals service](${personalisation.loginUrl}). We will contact you when we start the appeal.

					Planning Inspectorate
					${personalisation.contactEmailLPA}`
				);
			});

			it('populates for LDC appeals', () => {
				const template = NotifyService.templates.appealSubmission.v2LPANotification;
				const personalisation = {
					appealReferenceNumber: '6000000',
					appealSiteAddress: 'Address\nLine 2\nLine 3',
					appealType: 'a lawful development certificate',
					applicationDecision: '',
					isEnforcement: false,
					loginUrl: 'https://example.com/login',
					lpaReference: 'abc',
					referenceType: 'application reference',
					submissionDate: '17 March 2026',
					contactEmailLPA: 'test email address'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received a lawful development certificate appeal against application reference ${personalisation.lpaReference}.

					# Appeal details
					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress} 
					Application reference: ${personalisation.lpaReference}
					Submitted date: ${personalisation.submissionDate}

					When we start the appeal, you can [view the appeal in the manage your appeals service](${personalisation.loginUrl}). We will contact you when we start the appeal.

					Planning Inspectorate
					${personalisation.contactEmailLPA}`
				);
			});
		});

		describe('should populate lpaq.v2LPAQSubmitted', () => {
			it('should populate for non-enforcement appeals', () => {
				const template = NotifyService.templates.lpaq.v2LPAQSubmitted;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					lpaName: 'This LPA',
					lpaReference: 'abc',
					enforcementReference: 'enf-ref',
					isEnforcement: false,
					siteAddress: 'd\ne\nf',
					appealStartDate: '22 April 2025',
					questionnaireLink: 'download/questionnaire/here',
					contactEmail: 'example@test.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your questionnaire.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Planning application reference: ${personalisation.lpaReference}
					Start date: ${personalisation.appealStartDate}

					# What happens next
					1. Download a copy of your questionnaire at ${personalisation.questionnaireLink}
					2. We will review your questionnaire and contact you if we need any further information.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('should populate for enforcement appeals', () => {
				const template = NotifyService.templates.lpaq.v2LPAQSubmitted;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					lpaName: 'This LPA',
					lpaReference: 'abc',
					enforcementReference: 'enf-ref',
					isEnforcement: true,
					siteAddress: 'd\ne\nf',
					appealStartDate: '22 April 2025',
					questionnaireLink: 'download/questionnaire/here',
					contactEmail: 'example@test.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your questionnaire.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}
					Start date: ${personalisation.appealStartDate}

					# What happens next
					1. Download a copy of your questionnaire at ${personalisation.questionnaireLink}
					2. We will review your questionnaire and contact you if we need any further information.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		describe('should populate representation.v2LpaStatement', () => {
			it('populates for non-enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2LpaStatement;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '28 April 2025',
					contactEmail: 'example@test.com',
					lpaReference: 'abc',
					enforcementReference: '',
					isEnforcement: false,
					hasAppellantStatementJourney: false
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your statement.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next
					We will contact you if:
					- we receive any comments from interested parties

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('populates for enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2LpaStatement;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '28 April 2025',
					contactEmail: 'example@test.com',
					lpaReference: 'abc',
					enforcementReference: 'enf-ref',
					isEnforcement: true,
					hasAppellantStatementJourney: true
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your statement.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next
					We will contact you if:
					- the appellant submits a statement
					- we receive any comments from interested parties

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		describe('should populate representation.v2AppellantFinalComments', () => {
			it('populate for non-enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2AppellantFinalComment;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '22 April 2025',
					lpaReference: 'ghi',
					enforcementReference: '',
					isEnforcement: false,
					contactEmail: 'test@exmaple.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your final comments.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next
					We will contact you if the local planning authority submits final comments. The deadline for the local planning authority’s final comments is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('populate for enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2AppellantFinalComment;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '22 April 2025',
					lpaReference: 'ghi',
					enforcementReference: 'enf-ref',
					isEnforcement: true,
					contactEmail: 'test@exmaple.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your final comments.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next
					We will contact you if the local planning authority submits final comments. The deadline for the local planning authority’s final comments is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		describe('should populate representation.v2LpaFinalComments', () => {
			it('populate for non-enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2LpaFinalComment;
				const personalisation = {
					LPA: 'Test LPA',
					appealReferenceNumber: 'ABC123',
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '22 April 2025',
					lpaReference: 'ghi',
					enforcementReference: '',
					isEnforcement: false,
					contactEmail: 'test@exmaple.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your final comments.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next
					We will contact you when the appellant submits their final comments. The deadline for the appellant’s final comments is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('populate for enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2LpaFinalComment;
				const personalisation = {
					LPA: 'Test LPA',
					appealReferenceNumber: 'ABC123',
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '22 April 2025',
					lpaReference: 'ghi',
					enforcementReference: 'enf-ref',
					isEnforcement: true,
					contactEmail: 'test@exmaple.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your final comments.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next
					We will contact you when the appellant submits their final comments. The deadline for the appellant’s final comments is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		describe('should populate representation.v2ProofOfEvidenceSubmitted', () => {
			it('populate for non-enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2ProofOfEvidenceSubmitted;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					deadlineDate: '22 April 2025',
					siteAddress: 'a\nb\nc',
					lpaReference: 'ghi',
					enforcementReference: '',
					isEnforcement: false,
					contactEmail: 'test@exmaple.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your proof of evidence and witnesses.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next

					We will contact you when the local planning authority and any other parties submit their proof of evidence and witnesses. The deadline is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('populate for enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2ProofOfEvidenceSubmitted;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					deadlineDate: '22 April 2025',
					siteAddress: 'a\nb\nc',
					lpaReference: 'ghi',
					enforcementReference: 'enf-ref',
					isEnforcement: true,
					contactEmail: 'test@exmaple.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We have received your proof of evidence and witnesses.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next

					We will contact you when the local planning authority and any other parties submit their proof of evidence and witnesses. The deadline is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		describe('should populate representation.v2LpaProofsEvidence', () => {
			it('populate for non-enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2LpaProofsEvidence;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					lpaReference: 'abc',
					enforcementReference: '',
					isEnforcement: false,
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '28 April 2025',
					contactEmail: 'example@test.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We’ve received your proof of evidence and witnesses.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next
					We will contact you when the appellant and any other parties submit their proof of evidence and witnesses. The deadline is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('populate for enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2LpaProofsEvidence;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					lpaReference: 'abc',
					enforcementReference: 'enf-ref',
					isEnforcement: true,
					appealSiteAddress: 'd\ne\nf',
					deadlineDate: '28 April 2025',
					contactEmail: 'example@test.com'
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`We’ve received your proof of evidence and witnesses.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.appealSiteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next
					We will contact you when the appellant and any other parties submit their proof of evidence and witnesses. The deadline is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		it('should populate representation.v2IpCommentSubmitted ', () => {
			const template = NotifyService.templates.representations.v2IpCommentSubmitted;
			const personalisation = {
				appealReferenceNumber: 'ABC123',
				name: 'Geoff',
				contactEmail: 'test@exmaple.com'
			};

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`To ${personalisation.name}

				We’ve received your comment for the appeal: ${personalisation.appealReferenceNumber}.

				# What happens next

				The inspector will review all of the evidence. We will contact you by email when we make a decision.

				Planning Inspectorate
				${personalisation.contactEmail}`
			);
		});

		it('should populate appealSubmission.v2SignInToAppealADecision', () => {
			const template = NotifyService.templates.appealSubmission.v2registrationConfirmation;
			const personalisation = {
				link: 'https://example.com/login',
				name: 'Barry',
				contactEmail: 'test@exmaple.com'
			};

			const result = notifyService.populateTemplate(template, personalisation);
			expectMessage(
				result,
				`Sign in to appeal a planning decision: ${personalisation.link}

				We will send a code to your email address, so that you can sign in to the service.

				Planning Inspectorate
				${personalisation.contactEmail}`
			);
		});

		describe('should populate representations.v2R6ProofsEvidence', () => {
			it('populate non-enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2R6ProofsEvidence;
				const personalisation = {
					appealReferenceNumber: '1010101',
					siteAddress: 'a\nb\nc',
					deadlineDate: '30 April 2025',
					contactEmail: 'test@exmaple.com',
					rule6RecipientLine: 'To Rule 6 party',
					lpaReference: 'qwerty',
					enforcementReference: '',
					isEnforcement: false
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`${personalisation.rule6RecipientLine}

					We have received your proof of evidence and witnesses.

					# Appeal details
					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next
					We will contact you when the appellant, local planning authority and any other parties submit their proof of evidence and witnesses. The deadline is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('populate enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2R6ProofsEvidence;
				const personalisation = {
					appealReferenceNumber: '1010101',
					siteAddress: 'a\nb\nc',
					deadlineDate: '30 April 2025',
					contactEmail: 'test@exmaple.com',
					rule6RecipientLine: 'To Rule 6 party',
					lpaReference: 'qwerty',
					enforcementReference: 'enf-ref',
					isEnforcement: true
				};

				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`${personalisation.rule6RecipientLine}

					We have received your proof of evidence and witnesses.

					# Appeal details
					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next
					We will contact you when the appellant, local planning authority and any other parties submit their proof of evidence and witnesses. The deadline is ${personalisation.deadlineDate}.

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});

		describe('should populate representation.v2Rule6StatementSubmission', () => {
			it('populate non-enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2Rule6StatementSubmission;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					lpaReference: 'abc',
					enforcementReference: '',
					isEnforcement: false,
					siteAddress: 'd\ne\nf',
					contactEmail: 'example@test.com',
					rule6RecipientLine: 'To Rule 6 party'
				};
				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`${personalisation.rule6RecipientLine}

					We have received your statement.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Planning application reference: ${personalisation.lpaReference}

					# What happens next

					We will contact you when:

					- the local planning authority and any other parties have submitted their statements
					- we have received comments from interested parties

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});

			it('populate enforcement appeals', () => {
				const template = NotifyService.templates.representations.v2Rule6StatementSubmission;
				const personalisation = {
					appealReferenceNumber: 'ABC123',
					lpaReference: 'abc',
					enforcementReference: 'enf-ref',
					isEnforcement: true,
					siteAddress: 'd\ne\nf',
					contactEmail: 'example@test.com',
					rule6RecipientLine: 'To Rule 6 party'
				};
				const result = notifyService.populateTemplate(template, personalisation);
				expectMessage(
					result,
					`${personalisation.rule6RecipientLine}

					We have received your statement.

					# Appeal details

					^ Appeal reference number: ${personalisation.appealReferenceNumber}
					Address: ${personalisation.siteAddress}
					Enforcement notice reference: ${personalisation.enforcementReference}

					# What happens next

					We will contact you when:

					- the local planning authority and any other parties have submitted their statements
					- we have received comments from interested parties

					Planning Inspectorate
					${personalisation.contactEmail}`
				);
			});
		});
	});
});
