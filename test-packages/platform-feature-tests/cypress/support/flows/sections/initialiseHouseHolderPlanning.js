const applicationFormPage = require("../pages/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } =  require("../pages/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../pages/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../pages/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../pages/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../pages/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../pages/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../pages/prepare-appeal/ownSomeLandPage");
const { InspectorNeedAccessPage } = require("../pages/prepare-appeal/inspectorNeedaccessPage");
const { OtherAppealsPage } = require("../pages/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../pages/upload-documents/uploadApplicationFormPage");
const { ApplyAppealCostsPage } = require("../pages/upload-documents/applyAppealCostsPage");
const { HealthSafetyIssuesPage } = require("../pages/prepare-appeal/healthSafetyIssuesPage");
const { PrepareAppealSelector } = require("../../../page-objects/prepare-appeal/prepare-appeal-selector");

module.exports = (statusOfOriginalApplication,planning, grantedOrRefusedId,context) => {
	const prepareAppealSelector = new PrepareAppealSelector();
	const applicationNamePage = new ApplicationNamePage();
	const contactDetailsPage = new ContactDetailsPage();
	const appealSiteAddressPage = new AppealSiteAddressPage();
	const siteAreaPage = new SiteAreaPage();		
	const greenBeltPage = new GreenBeltPage();
	const ownAllLandPage = new OwnAllLandPage();
	const ownSomeLandPage = new OwnSomeLandPage();
	const inspectorNeedAccessPage = new InspectorNeedAccessPage();
	const healthSafetyIssuesPage = new HealthSafetyIssuesPage();
	const otherAppealsPage = new OtherAppealsPage();
	const uploadApplicationFormPage = new UploadApplicationFormPage();
	const applyAppealCostsPage = new ApplyAppealCostsPage();

	cy.get(grantedOrRefusedId).click();
	cy.advanceToNextPage();

	let currentDate = new Date();
	cy.get('#decision-date-householder-day').type(currentDate.getDate());
	cy.get('#decision-date-householder-month').type(currentDate.getMonth() + 1);
	cy.get('#decision-date-householder-year').type(currentDate.getFullYear());
	cy.advanceToNextPage();

	cy.get('[data-cy="answer-no"]').click();
	cy.advanceToNextPage();

    cy.get('[data-cy="application-type"]').should('have.text','Householder Planning');
	cy.advanceToNextPage('Continue to my appeal');

    cy.url().should('include','/appeal-householder-decision/planning-application-number');

	const applicationNumber = `TEST-${Date.now()}`;
	cy.get('[data-cy="application-number"]').type(applicationNumber);
	cy.advanceToNextPage();

    cy.url().should('include','/appeal-householder-decision/email-address');
	
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
		applicationFormPage('householder','other',dynamicId);
		//Contact details
		applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant);
				
		contactDetailsPage.addContactDetailsData(context);

		//Site Details
		appealSiteAddressPage.addAppealSiteAddressData(context);		
		//What is the area of the appeal site?
		siteAreaPage.addSiteAreaData(planning,context?.applicationForm?.areaUnits,context);

		//Is the appeal site in a green belt?(Ans:Yes)
		greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

		//Do you own all the land involved in the appeal?
		ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);
		
		if(!context?.applicationForm?.isOwnsAllLand){
			//Do you own some of the land involved in the appeal?
			ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand,context);

		}
		//Will an inspector need to access your land or property?
		inspectorNeedAccessPage.addInspectorNeedaccessData(context?.applicationForm?.isInspectorNeedAccess);			
	
		//Health and safety issues
		healthSafetyIssuesPage.addHealthSafetyIssuesData(context);
		
		//What is the application reference number?
		cy.get('#applicationReference').invoke('val').then((inputValue)=>{
			expect(inputValue).to.equal(applicationNumber);
		});
	
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
		if(context?.applicationForm?.iaUpdateDevelopmentDescription){
			cy.get('[data-cy="answer-yes"]').click();
			cy.advanceToNextPage();
		} else{
			cy.get('[data-cy="answer-no"]').click();
			cy.advanceToNextPage();
		}
		
		otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals,context);
		
		cy.uploadDocuments('householder','upload-application-form',dynamicId);
		uploadApplicationFormPage.addUploadApplicationFormData(context,dynamicId);
		
		//Upload your appeal statement
		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
		cy.advanceToNextPage();
		//Do you need to apply for an award of appeal costs?
		applyAppealCostsPage.addApplyAppealCostsData(context);
				
		//submit
		cy.get(`a[href*="/appeals/householder/submit/declaration?id=${dynamicId}"]`).click();
		cy.wait(2000);
		//Cypress.Commands.add('advanceToNextPage', (text = 'Continue') => {
		cy.get('.govuk-button').contains('Accept and submit').click();

		cy.get('.govuk-panel__title').invoke('text').should((text)=>{
			expect(text.trim()).to.equal('Appeal submitted');
		});			
	});
};
