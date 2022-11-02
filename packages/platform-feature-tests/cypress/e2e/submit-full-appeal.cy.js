const { submitAppealFlow } = require('../support/flows/appeal');

describe('Appeal uploads', () => {
	[
		[
			'no decision',
			'hearing',
			'in draft',
			{ expectedFolderHierarchy: ['', ''], expectedFileName: 'appeal-statement-valid.pdf' }
		],
		['refused', 'written', 'finalised']
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
