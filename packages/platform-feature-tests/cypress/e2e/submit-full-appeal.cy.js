const { submitAppealFlow } = require('../support/flows/appeal');

describe('Appeal uploads', () => {
	[
		[
			'no decision',
			'hearing',
			'in draft',
			[
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
				}
			]
		],
		[
			'refused',
			'written',
			'finalised',
			[
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
					expectedFileName: 'decision-letter.pdf'
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
					expectedFileName: 'planning-obligation.pdf'
				},
				{
					expectedFolderHierarchy: ['1 Main Party', 'Appellant/Agent/Applicant'],
					expectedFileName: 'other-supporting-documents.pdf'
				}
			]
		]
	].forEach((context) => {
		it(`sends a householder planning application successfully to Horizon where the original application status is "${context[0]}", the decision type requested is "${context[1]}" and the planning obligation status is "${context[2]}"`, () => {
			submitAppealFlow({
				statusOfOriginalApplication: context[0],
				typeOfDecisionRequested: context[1],
				statusOfPlanningObligation: context[2]
			});

			// TODO: this code below needs testing with Horizon when we get automated test access!

			/*
			cy.visit('https://horizontest.planninginspectorate.gov.uk/otcs/cs.exe?func=llworkspace')
			// TODO: figure out how to interact with Drop down for username and password that is part of browser here
			
			// Horizon main screen
			cy.get('#rowCell0').get('.browseItemName>a').eq(0).click()

			cy.get('#rowCell17').get('.browseItemName>a').eq(0).click() // Clicks on appeal type (not householder)

			cy.get('#browseViewCoreTable').get('.browseListHeaderName>a').eq(0).click() // Puts latest appeals at top of list
			cy.get('#rowCell0').get('.browseItemName>a').eq(0).click()
			
			cy.get('#browseViewCoreTable').get('.browseListHeaderCenterText>a') // Puts latest appeals to top
			cy.get('#rowCell0').get('.browseItemName>a').eq(0).click()

			// For loop for each doc type
			let docTypeFolderMappings = context[3];

			for (docTypeFolderMapping in docTypeFolderMappings) {
				
				for (expectedFolderName in docTypeFolderMapping.expectedFolderHierarchy) {
					cy.get('#browseViewCoreTable').get('.browseItemName').get(`a:contains(${expectedFolderName})`).click();
				}

				cy.get('#browseViewCoreTable').get('browseItemName').get(`a:contains(${expectedFileName})`).should('be.visible') // This is where we check if the file is in the right place
				cy.get('#trail>a').eq(4).click()// Then we need to go bacck to the top level of the folder structure
			}
			*/
		});
	});
});
