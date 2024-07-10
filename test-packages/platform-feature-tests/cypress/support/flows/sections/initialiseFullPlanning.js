const applicationFormPage = require("../pages/prepare-appeal/applicationFormPage");
const applicationNamePage = require("../pages/prepare-appeal/applicationNamePage");
const contactDetailsPage = require("../pages/prepare-appeal/contactDetailsPage");
const phoneNumberPage = require("../pages/prepare-appeal/phoneNumberPage");
const appealSiteAddressPage = require("../pages/prepare-appeal/appealSiteAddressPage");
const siteAreaPage = require("../pages/prepare-appeal/siteAreaPage");
const greenBeltPage = require("../pages/prepare-appeal/greenBeltPage");
const ownAllLandPage = require("../pages/prepare-appeal/ownAllLandPage");
const ownSomeLandPage = require("../pages/prepare-appeal/ownSomeLandPage");


module.exports = (statusOfOriginalApplication,planning, grantedOrRefusedId,context) => {
	
	
	cy.get(grantedOrRefusedId).click();
	cy.advanceToNextPage();
	//cy.wait(2000);
	let currentDate = new Date();
	cy.get('#decision-date-day').type(currentDate.getDate());
	cy.get('#decision-date-month').type(currentDate.getMonth() + 1);
	cy.get('#decision-date-year').type(currentDate.getFullYear());
	cy.advanceToNextPage();
	//cy.wait(2000);
	cy.get('[data-cy="answer-no"]').click();
	cy.advanceToNextPage();
	//cy.wait(2000);

	cy.advanceToNextPage('Continue to my appeal');
	//cy.wait(2000);
	cy.get('[data-cy="application-number"]').type(`TEST-${Date.now()}`);
	cy.advanceToNextPage();

	//cy.get('#email-address').type('appealplanningdecisiontest@planninginspectorate.gov.uk');
	cy.intercept('POST','/full-appeal/submit-appeal/list-of-documents').as('postRequest');
	cy.get('[data-cy="email-address"]').type('appellant2@planninginspectorate.gov.uk');
	cy.advanceToNextPage();
	//cy.wait(2000);
	
	
	cy.get('#email-code').type('12345');
	cy.advanceToNextPage();

	// cy.visit(
	// 	`${Cypress.config('appeals_beta_base_url')}/full-appeal/submit-appeal/email-address-confirmed`
	// );
	//cy.wait(2000);
	cy.advanceToNextPage();
	//cy.wait(2000);
	cy.advanceToNextPage();
	cy.wait(2000);
	cy.location('search').then((search)=>{
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');
		//cy.log('Test id in task page',dynamicId);
		applicationFormPage('full-planning','other',dynamicId);
		//Contact details
		applicationNamePage(context?.applicationForm?.isAppellant);

		contactDetailsPage()

		phoneNumberPage();
		//Site Details
		appealSiteAddressPage();		
		//What is the area of the appeal site?
		siteAreaPage(planning,context?.applicationForm?.areaUnits,context);

		//Is the appeal site in a green belt?(Ans:Yes)
		greenBeltPage(context?.applicationForm?.appellantInGreenBelt);
		//cy.get('#appellantGreenBelt').click();
		//cy.advanceToNextPage();
		//Do you own all the land involved in the appeal?
		ownAllLandPage(context?.applicationForm?.isOwnsAllLand);
		// cy.get('#ownsAllLand-2').click();
		// cy.advanceToNextPage();
		if(!context?.applicationForm?.isOwnsAllLand){
			//Do you own some of the land involved in the appeal?
			ownSomeLandPage(context?.applicationForm?.isOwnsSomeLand,context);

		}
		

		//cy.get('#ownsSomeLand').click();
		//cy.advanceToNextPage();
		//Do you know who owns the rest of the land involved in the appeal?
		//ownsLandInvolvedPage(context?.applicationForm?.knowsAllOwners);
		//cy.get('#knowsOtherOwners-2').click();
		//cy.advanceToNextPage();
		//Identifying the landowners
		//cy.get('#identifiedOwners').check();
		//cy.advanceToNextPage();
		//Advertising your appeal
		//cy.get('#advertisedAppeal').check();
		//cy.advanceToNextPage();
		//Telling the landowners
		//cy.get('#informedOwners').check();
		//cy.advanceToNextPage();
		//Is the appeal site part of an agricultural holding?(Ans:yes)
		cy.get('#agriculturalHolding').click();
		cy.advanceToNextPage();
		//Are you a tenant of the agricultural holding?(Ans:yes)
		cy.get('#tenantAgriculturalHolding').click();
		cy.advanceToNextPage();
		//Are there any other tenants?(Ans:yes)
		cy.get('#otherTenantsAgriculturalHolding').click();
		cy.advanceToNextPage();
		//Telling the tenants
		cy.get('#informedTenantsAgriculturalHolding').check();
		cy.advanceToNextPage();
		//Will an inspector need to access your land or property?
		cy.get('#appellantSiteAccess').click();
		cy.get('#appellantSiteAccess_appellantSiteAccessDetails').type('appellantSiteAccess_appellantSiteAccessDetails1234567890!"£$%^&*(9)');
		cy.advanceToNextPage();
		//Health and safety issues
		cy.get('#appellantSiteSafety').click();
		cy.get('#appellantSiteSafety_appellantSiteSafetyDetails').type('appellantSiteSafety_appellantSiteSafetyDetails1234567890!"£$%^&*(10)');
		cy.advanceToNextPage();
		//What is the application reference number?
		cy.get('#applicationReference').type('12345x6');
		cy.advanceToNextPage();
		//What date did you submit your application?
		cy.get('#onApplicationDate_day').type(currentDate.getDate() - 1);
		cy.get('#onApplicationDate_month').type(currentDate.getMonth() - 1);
		cy.get('#onApplicationDate_year').type(currentDate.getFullYear());
		cy.advanceToNextPage();
		//Enter the description of development that you submitted in your application
		cy.get('#developmentDescriptionOriginal').type ('developmentDescriptionOriginal-hint123456789!£$%&*j');
		cy.advanceToNextPage();
		//Did the local planning authority change the description of development?
		cy.get('#updateDevelopmentDescription').click();
		cy.advanceToNextPage();
		//How would you prefer us to decide your appeal?
		cy.get('#appellantProcedurePreference-2').click();
		cy.advanceToNextPage();
		//Why would you prefer a hearing?
		cy.get('#appellantPreferHearingDetails').type('To Argue in the court12345!£%^&*');
		cy.advanceToNextPage();
		//Are there other appeals linked to your development?(Ans:YES)
		cy.get('#appellantLinkedCase').click();
		cy.advanceToNextPage();
		//Enter the appeal reference number
		cy.get('#appellantLinkedCase').type('9876T40');
		cy.advanceToNextPage();
		//You’ve added a linked appeal(Ans:No)
		cy.get('#appellantLinkedCaseAdd-2').click();
		cy.advanceToNextPage();

		cy.uploadDocuments('full-planning','upload-application-form',dynamicId);
		//Upload your application form
		cy.uploadFileFromFixtureDirectory('letter-confirming-planning-application.pdf');
		cy.advanceToNextPage();
		//Upload evidence of your agreement to change the description of development
		cy.uploadFileFromFixtureDirectory('additional-final-comments-1.pdf');
		cy.advanceToNextPage();
		if(statusOfOriginalApplication !== 'no decision'){
			cy.uploadFileFromFixtureDirectory('decision-letter.pdf');
		cy.advanceToNextPage();
		}

		cy.get('[data-cy="answer-yes"]').click();
		cy.advanceToNextPage();	
		cy.get('[data-cy="answer-finalised"]').click();
		cy.advanceToNextPage();	
		
		//Upload the decision letter from the local planning authority
		cy.uploadFileFromFixtureDirectory('additional-final-comments-2.pdf');
		cy.advanceToNextPage();
		cy.get('[data-cy="answer-yes"]').click();
		cy.advanceToNextPage();	
		//Do you plan to submit a planning obligation to support your appeal?
		// cy.get('#planningObligation').click();
		// cy.advanceToNextPage();

		//What is the status of your planning obligation?
		// cy.get('#statusPlanningObligation-2').click();
		// cy.advanceToNextPage();
		// //Did you submit a separate ownership certificate and agricultural land declaration with your application?
		// cy.get('#ownershipCertificate').click();
		// cy.advanceToNextPage();
		// //Upload your separate ownership certificate and agricultural land declaration
		cy.uploadFileFromFixtureDirectory('draft-planning-obligation.pdf');
		cy.advanceToNextPage();
		//Upload your appeal statement
		cy.uploadFileFromFixtureDirectory('appeal-statement-valid.pdf');
		cy.advanceToNextPage();
		//Upload your draft statement of common ground
		cy.uploadFileFromFixtureDirectory('draft-statement-of-common-ground.pdf');
		cy.advanceToNextPage();
		//Do you need to apply for an award of appeal costs?
		cy.get('#costApplication').click();
		cy.advanceToNextPage();
		//Upload your application for an award of appeal costs
		cy.uploadFileFromFixtureDirectory('other-supporting-docs.pdf');
		cy.advanceToNextPage();
		//Did you submit a design and access statement with your application?
		cy.get('#designAccessStatement').click();
		cy.advanceToNextPage();
		//Upload your design and access statement
		cy.uploadFileFromFixtureDirectory('design-and-access-statement.pdf');
		cy.advanceToNextPage();
		//Upload your plans, drawings and supporting documents you submitted with your application
		cy.uploadFileFromFixtureDirectory('plans-drawings-and-supporting-documents.pdf');
		cy.advanceToNextPage();
		//Do you have any new plans or drawings that support your appeal?
		cy.get('#newPlansDrawings').click();
		cy.advanceToNextPage();
		//Upload your new plans or drawings
		cy.uploadFileFromFixtureDirectory('plans-drawings.jpeg');
		cy.advanceToNextPage();
		//Do you have any other new documents that support your appeal?#
		cy.get('#otherNewDocuments').click();
		cy.advanceToNextPage();
		//Upload your other new supporting documents
		cy.uploadFileFromFixtureDirectory('other-supporting-docs.pdf');
		cy.advanceToNextPage();
		//submit
		cy.get(`a[href*="/appeals/full-planning/submit/declaration?id=${dynamicId}"]`).click();
		cy.wait(2000);
		//Cypress.Commands.add('advanceToNextPage', (text = 'Continue') => {
		cy.get('.govuk-button').contains('Accept and submit').click();

		cy.get('.govuk-panel__title').invoke('text').should((text)=>{
			expect(text.trim()).to.equal('Appeal submitted');
		});

		//});

		//https://appeals-service-test.planninginspectorate.gov.uk/appeals/full-planning/submit/declaration?id=0781ab81-1682-48a7-8801-6c2ea7bfc737              
        //Declaration





		














				
	});

	

};
