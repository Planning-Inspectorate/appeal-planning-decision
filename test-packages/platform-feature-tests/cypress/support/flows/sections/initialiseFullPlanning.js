const applicationFormPage = require("../pages/prepare-appeal/applicationFormPage");
const applicationNamePage = require("../pages/prepare-appeal/applicationNamePage");
const contactDetailsPage = require("../pages/prepare-appeal/contactDetailsPage");
const phoneNumberPage = require("../pages/prepare-appeal/phoneNumberPage");
const appealSiteAddressPage = require("../pages/prepare-appeal/appealSiteAddressPage");
const siteAreaPage = require("../pages/prepare-appeal/siteAreaPage");
const greenBeltPage = require("../pages/prepare-appeal/greenBeltPage");
const ownAllLandPage = require("../pages/prepare-appeal/ownAllLandPage");
const ownSomeLandPage = require("../pages/prepare-appeal/ownSomeLandPage");
const agriculturalHoldingPage = require("../pages/prepare-appeal/agriculturalHoldingPage");
const inspectorNeedAccessPage = require("../pages/prepare-appeal/inspectorNeedaccessPage");
const decideAppealsPage = require("../pages/prepare-appeal/decideAppealPage");
const otherAppealsPage = require("../pages/prepare-appeal/otherAppealsPage");
const uploadApplicationFormPage = require("../pages/upload-documents/uploadApplicationFormPage");
const submitPlanningObligationPage = require("../pages/upload-documents/submitPlanningObligationPage");
const separateOwnershipCertificatePage = require("../pages/upload-documents/separateOwnershipCertificatePage");
const applyAppealCostsPage = require("../pages/upload-documents/applyAppealCostsPage");
const submitDesignAccessStatementPage = require("../pages/upload-documents/submitDesignAccessStatementPage");
const newPlansDrawingsPage = require("../pages/upload-documents/newPlansDrawingsPage");
const otherNewDocumentsPage = require("../pages/upload-documents/otherNewDocumentsPage");

module.exports = (statusOfOriginalApplication,planning, grantedOrRefusedId,context) => {
	
	
	cy.get(grantedOrRefusedId).click();
	cy.advanceToNextPage();
	
	let currentDate = new Date();
	cy.get('#decision-date-day').type(currentDate.getDate());
	cy.get('#decision-date-month').type(currentDate.getMonth() + 1);
	cy.get('#decision-date-year').type(currentDate.getFullYear());
	cy.advanceToNextPage();

	cy.get('[data-cy="answer-no"]').click();
	cy.advanceToNextPage();	

	cy.advanceToNextPage('Continue to my appeal');

	cy.get('[data-cy="application-number"]').type(`TEST-${Date.now()}`);
	cy.advanceToNextPage();
	
	cy.intercept('POST','/full-appeal/submit-appeal/list-of-documents').as('postRequest');
	cy.get('[data-cy="email-address"]').type('appellant2@planninginspectorate.gov.uk');
	cy.advanceToNextPage();	
	
	cy.get('#email-code').type('12345');
	cy.advanceToNextPage();

	cy.advanceToNextPage();

	cy.advanceToNextPage();
	cy.wait(2000);
	cy.location('search').then((search)=>{
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');
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
	
		//Do you own all the land involved in the appeal?
		ownAllLandPage(context?.applicationForm?.isOwnsAllLand);
	
		if(!context?.applicationForm?.isOwnsAllLand){
			//Do you own some of the land involved in the appeal?
			ownSomeLandPage(context?.applicationForm?.isOwnsSomeLand,context);
			cy.advanceToNextPage();			
		}
		agriculturalHoldingPage(context?.applicationForm?.isAgriculturalHolding,context);		
		
		
		inspectorNeedAccessPage(context?.applicationForm?.isInspectorNeedAccess);		
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
		decideAppealsPage(context?.applicationForm?.appellantProcedurePreference);
		otherAppealsPage(context?.applicationForm?.anyOtherAppeals,context);
		

		
		uploadApplicationFormPage(context,dynamicId);

		submitPlanningObligationPage(context);

		separateOwnershipCertificatePage(context);

		
		if(context?.applicationForm?.appellantProcedurePreference !== 'written'){
			//Upload your draft statement of common ground
			cy.uploadFileFromFixtureDirectory('draft-statement-of-common-ground.pdf');
			cy.advanceToNextPage();
		}
		
		applyAppealCostsPage(context);
		submitDesignAccessStatementPage(context);
		newPlansDrawingsPage(context);
		otherNewDocumentsPage(context);
		
		

		//submit
		cy.get(`a[href*="/appeals/full-planning/submit/declaration?id=${dynamicId}"]`).click();
		cy.wait(2000);
		//Cypress.Commands.add('advanceToNextPage', (text = 'Continue') => {
		cy.get('.govuk-button').contains('Accept and submit').click();

		// cy.get('.govuk-panel__title').invoke('text').should((text)=>{
		// 	expect(text.trim()).to.equal('Appeal submitted');
		// });

		//});

		//https://appeals-service-test.planninginspectorate.gov.uk/appeals/full-planning/submit/declaration?id=0781ab81-1682-48a7-8801-6c2ea7bfc737              
        //Declaration





		














				
	});

	

};
