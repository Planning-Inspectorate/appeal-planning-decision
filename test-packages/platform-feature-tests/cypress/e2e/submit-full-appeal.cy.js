import { typeOfPlanningApplication } from "../fixtures/lpas.json";
const { submitAppealFlow } = require('../support/flows/appeal');
//const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');

describe('Appeal uploads', () => {
	[
		{
			statusOfOriginalApplication: 'no decision',
			typeOfDecisionRequested: 'hearing',
			statusOfPlanningObligation: 'in draft',
			typeOfPlanningApplication: 'answer-full-appeal',
			applicationForm: {
				applicationMadeByMe: true,
				areaUnits:'hectare',
				appellantInGreenBelt: true,
				isOwnsAllLand: true,
				isagriculturalHolding: true
			},
			finalComments: {
				check: false, // TODO: set these to true after feature flag introduced
				uploadAdditionalDocuments: false
			},
			expectedFilesAndFoldersInHorizon: [
				{
					expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
					expectedFileName: 'planning-application-form.pdf'
				},
				{
					expectedFolderHierarchy: [
						'0 Inspector File',
						"01 Appelant's Initial Documents",
						'05 Plans',
						'01 Application Plans'
					],
					expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
				},
				{
					expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
					expectedFileName: 'design-and-access-statement.pdf'
				},
				{
					expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
					expectedFileName: 'draft-statement-of-common-ground.pdf'
				},
				{
					expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
					expectedFileName: 'letter-confirming-planning-application.pdf'
				},
				{
					expectedFolderHierarchy: [
						'0 Inspector File',
						"01 Appelant's Initial Documents",
						'02 Statement and appendicies'
					],
					expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
				},
				{
					expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
					expectedFileName: 'letter-confirming-planning-obligation.pdf'
				},
				{
					expectedFolderHierarchy: [
						'0 Inspector File',
						"01 Appelant's Initial Documents",
						'05 Plans',
						'02 Plans submitted after LPA decision'
					],
					expectedFileName: 'plans-drawings.jpeg'
				},
				{
					expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
					expectedFileName: 'draft-planning-obligation.pdf'
				},
				{
					expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
					expectedFileName: 'other-supporting-documents.pdf'
				},
				{
					expectedFolderHierarchy: [
						'0 Inspector File',
						'05 Final comments',
						'Appellant final comments'
					],
					expectedFileName: 'final-comments.pdf'
				}
				
			]
		},
		// {
		// 	statusOfOriginalApplication: 'no decision',
		// 	typeOfDecisionRequested: 'hearing',
		// 	statusOfPlanningObligation: 'in draft',
		// 	typeOfPlanningApplication: 'answer-full-appeal',
		// 	applicationForm: {
		// 		applicationMadeByMe: false,
		// 		areaUnits:'hectare'
		// 	},
		// 	finalComments: {
		// 		check: false, // TODO: set these to true after feature flag introduced
		// 		uploadAdditionalDocuments: false
		// 	},
		// 	expectedFilesAndFoldersInHorizon: [
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'planning-application-form.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				"01 Appelant's Initial Documents",
		// 				'05 Plans',
		// 				'01 Application Plans'
		// 			],
		// 			expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'design-and-access-statement.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'draft-statement-of-common-ground.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'letter-confirming-planning-application.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				"01 Appelant's Initial Documents",
		// 				'02 Statement and appendicies'
		// 			],
		// 			expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'letter-confirming-planning-obligation.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				"01 Appelant's Initial Documents",
		// 				'05 Plans',
		// 				'02 Plans submitted after LPA decision'
		// 			],
		// 			expectedFileName: 'plans-drawings.jpeg'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
		// 			expectedFileName: 'draft-planning-obligation.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
		// 			expectedFileName: 'other-supporting-documents.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				'05 Final comments',
		// 				'Appellant final comments'
		// 			],
		// 			expectedFileName: 'final-comments.pdf'
		// 		}
				
		// 	]
		// }
		// ,
		// {
		// 	statusOfOriginalApplication: 'refused',
		// 	typeOfDecisionRequested: 'written',
		// 	statusOfPlanningObligation: 'finalised',
		// 	finalComments: {
		// 		check: false, // TODO: set these to true after feature flag introduced
		// 		uploadAdditionalDocuments: true
		// 	},
		// 	expectedFilesAndFoldersInHorizon: [
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'planning-application-form.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				"01 Appelant's Initial Documents",
		// 				'05 Plans',
		// 				'01 Application Plans'
		// 			],
		// 			expectedFileName: 'plans-drawings-and-supporting-documents.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'design-and-access-statement.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'decision-letter.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				"01 Appelant's Initial Documents",
		// 				'02 Statement and appendicies'
		// 			],
		// 			expectedFileName: 'ownership-certificate-and-agricultural-land-declaration.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', "01 Appelant's Initial Documents"],
		// 			expectedFileName: 'letter-confirming-planning-obligation.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				"01 Appelant's Initial Documents",
		// 				'05 Plans',
		// 				'02 Plans submitted after LPA decision'
		// 			],
		// 			expectedFileName: 'plans-drawings.jpeg'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['0 Inspector File', '07 Planning Obligation'],
		// 			expectedFileName: 'planning-obligation.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
		// 			expectedFileName: 'other-supporting-documents.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				'05 Final comments',
		// 				'Appellant final comments'
		// 			],
		// 			expectedFileName: 'final-comments.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				'05 Final comments',
		// 				'Appellant final comments'
		// 			],
		// 			expectedFileName: 'additional-final-comments-1.pdf'
		// 		},
		// 		{
		// 			expectedFolderHierarchy: [
		// 				'0 Inspector File',
		// 				'05 Final comments',
		// 				'Appellant final comments'
		// 			],
		// 			expectedFileName: 'additional-final-comments-2.pdf'
		// 		}
		// 	]
		// }
	].forEach((context) => {
		const {
			statusOfOriginalApplication,
			typeOfDecisionRequested,
			statusOfPlanningObligation,
			finalComments,
			typeOfPlanningApplication
			// , expectedFilesAndFoldersInHorizon // NOTE: commented out since this variable isn't used yet, so linting will be angry!
		} = context;
			// Full planning
			//typeOfPlanningApplication?.forEach((planning) => {
				it(`sends a Full planning application successfully to Horizon where the original application status is "${statusOfOriginalApplication}", 
				the decision type requested is "${typeOfDecisionRequested}", the planning obligation status is "${statusOfPlanningObligation}", and 
				final comments config is: ${finalComments}`, () => {
				submitAppealFlow({
					statusOfOriginalApplication,
					typeOfDecisionRequested,
					statusOfPlanningObligation,
					planning:typeOfPlanningApplication,
					context
					
				});
	
				if (finalComments.check) {
					// TODO: add feature flag check here
	
					////////////////////////////////////////////////
					///// TODO: This section needs sorting out /////
					////////////////////////////////////////////////
	
					// TODO: replace cy.request with axios
	
					// const appealId = 123456; //TODO: we need to set this properly
					// const appeal = cy.request(
					// 	`${Cypress.config('appeals_beta_base_url')}/api/v1/appeals/${appealId}`
					// );
					// const caseReference = appeal['case_reference'];
					const caseReference = 'ABCDEF'; //TODO: we need to extract the case reference number from the above
	
					//cy.stub(NotifyBuilder, 'sendEmail');
	
					////////////////////////////////////////////
					///// Appeal closed for comments check /////
					////////////////////////////////////////////
	
					// request to horizon to get final comments end date; response mocked since we can't access Horizon to set this date
					cy.intercept('POST', `${Cypress.config('horizon_base_url')}`, {
						fixture: 'horizon-get-case-response-with-final-comments-date-in-past.json'
					});
	
					// simulates clicking link in 'add final comments' email which will be sent to appellant via a case worker
					cy.visit(
						`${Cypress.config('appeals_beta_base_url')}/api/v1/case/${caseReference}/final_comments`
					);
	
					expect(cy.url()).to.equal(
						`${Cypress.config(
							'appeals_beta_base_url'
						)}/api/v1/case/${caseReference}/final_comments/closed`
					);
	
					//expect(NotifyBuilder.sendEmail).to.not.be.called;
	
					//////////////////////////////////////////
					///// Appeal open for comments check /////
					//////////////////////////////////////////
	
					// request to horizon to get final comments end date; response mocked since we can't access Horizon to set this date
					cy.intercept('POST', `${Cypress.config('horizon_base_url')}`, {
						fixture: 'horizon-get-case-response-with-final-comments-date-in-future.json'
					});
	
					// simulates clicking link in 'add final comments' email which will be sent to appellant via a case worker
					cy.visit(
						`${Cypress.config('appeals_beta_base_url')}/api/v1/case/${caseReference}/final_comments`
					);
	
					//expect(NotifyBuilder.sendEmail).to.be.called;
	
					/////////////////////////////////
					///// Input the secure code /////
					/////////////////////////////////
	
					const secureCode = 1234; //TODO: we need to find a way to get this!
	
					// Enter no code
					cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
					cy.get('[data-cy="error-message"]').should('have.text', 'Enter the code');
	
					// Enter invalid code
					cy.get('[data-cy="secure-code-entry"]').type('blah');
					cy.get('[data-cy="error-message"]').should('have.text', 'Enter a correct code');
	
					// Click "not received email"
					cy.get('[data-cy="not-received-email"]').click();
					//expect(NotifyBuilder.sendEmail).to.be.called;
	
					// Enter valid code
					cy.get('[data-cy="secure-code-entry"]').type(secureCode);
					cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
	
					//////////////////////////////
					///// Add final comments /////
					//////////////////////////////
	
					// Enter no text
					cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
					cy.get('[data-cy="error-message"]').should('have.text', 'Select your final comments');
	
					// Enter too much text
					cy.fixture('final-comments-text-too-long').then((text) => {
						cy.get('[data-cy="final-comments-input"]').type(text);
					});
					cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
					expect(cy.url()).to.equal(
						`${Cypress.config('appeals_beta_base_url')}/case/${caseReference}/final_comments`
					); // TODO: finalise this (We shouldn't have moved off the page)
	
					// Enter just enough text
					cy.fixture('final-comments-text-just-right').then((text) => {
						cy.get('[data-cy="final-comments-input"]').type(text);
					});
	
					// Check what happens when the sensitive info checkbox isn't checked
					cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
					expect('[data-cy="error"]').to.be.visible; // TODO: check if this is correct
	
					// Click the sensitive info checkbox and progress
					cy.get('[data-cy="sensitive-info-checkbox"]').click();
					cy.get('[data-cy="continue"]').click();
	
					///////////////////////////////////////
					///// Upload additional documents /////
					///////////////////////////////////////
	
					if (finalComments.uploadAdditionalDocuments) {
						cy.get('[data-cy="upload-additional-documents"]').click();
						cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
	
						// Press continue without uploading files
						cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
						// TODO: check error message is visible on page (and check if Abby/Kehinde has updated AS-5433 with correct error message): 'Select your final comments'
	
						// TODO: Upload .txt (should fail)
						// TODO: Upload file greater than 25MB
						// TODO: Upload valid DOC/DOCX/TIF/JPEG/PNG files
						cy.uploadFileFromFixturesDirectory('additional-final-comments-1.pdf');
						cy.uploadFileFromFixturesDirectory('additional-final-comments-2.pdf');
	
						cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
						// TODO: check that error messages are visible on page:
						//   - '{file name} must be a DOC, DOCX, PDF, TIF, JPG or PNG' is shown
						//   - '{file name} must be smaller than 25MB'
						// TODO: remove the invalid files
						cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
					} else {
						cy.get('[data-cy="do-not-upload-additional-documents"]').click();
						cy.get('[data-cy="continue"]').click(); // TODO: check if this is the correct selector!
					}
	
					////////////////////////////////////
					///// Check Answers and Submit /////
					////////////////////////////////////
	
					// TODO: we want to verify that the final comments text is as we expect when we first load this screen
	
					// TODO: we want to verify that the file names are as expected when we first load this screen
					if (finalComments.uploadAdditionalDocuments) {
						// Check for the correct file names
					} else {
						// Check there's no file names
					}
	
					// TODO: we want to change both the text and additional docs (if applicable) and check if the stuff above updates
					if (finalComments.uploadAdditionalDocuments) {
						// TODO: go back and add additional document and check if change is reflected on this page
					}
	
					// TODO: Go back to "Add final comments screen" using back buttons, then come back here (check if selector used below is correct)
					cy.get('[data-cy="back"]').click();
					cy.get('[data-cy="back"]').click();
					cy.get('[data-cy="back"]').click();
					cy.get('[data-cy="continue"]').click();
					cy.get('[data-cy="continue"]').click();
					cy.get('[data-cy="continue"]').click();
	
					// Submit
					cy.get('[data-cy="continue"]').click();
				
				}
				
			});

		//	})
	});
});
