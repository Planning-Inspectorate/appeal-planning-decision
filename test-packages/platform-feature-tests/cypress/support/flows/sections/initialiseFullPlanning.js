const applicationFormPage = require("../pages/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } =  require("../pages/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../pages/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../pages/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../pages/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../pages/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../pages/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../pages/prepare-appeal/ownSomeLandPage");
const { AgriculturalHoldingPage } = require("../pages/prepare-appeal/agriculturalHoldingPage");
const { InspectorNeedAccessPage } = require("../pages/prepare-appeal/inspectorNeedAccessPage");
const { DecideAppealsPage } = require("../pages/prepare-appeal/decideAppealsPage");
const { OtherAppealsPage } = require("../pages/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../pages/upload-documents/uploadApplicationFormPage");
const { SubmitPlanningObligationPage } = require("../pages/upload-documents/submitPlanningObligationPage");
const { SeparateOwnershipCertificatePage }= require("../pages/upload-documents/separateOwnershipCertificatePage");
const { ApplyAppealCostsPage } = require("../pages/upload-documents/applyAppealCostsPage");
const { SubmitDesignAccessStatementPage } = require("../pages/upload-documents/submitDesignAccessStatementPage");
const { NewPlansDrawingsPage } = require("../pages/upload-documents/newPlansDrawingsPage");
const { OtherNewDocumentsPage } = require("../pages/upload-documents/otherNewDocumentsPage");
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
	const agriculturalHoldingPage = new AgriculturalHoldingPage();
	const inspectorNeedAccessPage = new InspectorNeedAccessPage();
	const healthSafetyIssuesPage = new HealthSafetyIssuesPage();
	const decideAppealsPage = new DecideAppealsPage();
	const otherAppealsPage = new OtherAppealsPage();
	const uploadApplicationFormPage = new UploadApplicationFormPage();
	const submitPlanningObligationPage = new SubmitPlanningObligationPage();
	const separateOwnershipCertificatePage = new SeparateOwnershipCertificatePage();
	const applyAppealCostsPage = new ApplyAppealCostsPage();
	const submitDesignAccessStatementPage = new SubmitDesignAccessStatementPage();
	const newPlansDrawingsPage = new NewPlansDrawingsPage();
	const otherNewDocumentsPage = new OtherNewDocumentsPage();


	cy.get(grantedOrRefusedId).click();
	cy.advanceToNextPage();
	
	let currentDate = new Date();
	cy.get(prepareAppealSelector?._selectors?.decisionDateDay).type(currentDate.getDate());
	cy.get(prepareAppealSelector?._selectors?.decisionDateMonth).type(currentDate.getMonth() + 1);
	cy.get(prepareAppealSelector?._selectors?.decisionDateYear).type(currentDate.getFullYear());
	cy.advanceToNextPage();

	cy.get('[data-cy="answer-no"]').click();
	cy.advanceToNextPage();

	//cy.get('[data-cy="application-type"]').should('have.text','Full Appeal');
	cy.advanceToNextPage('Continue to my appeal');

	const applicationNumber = `TEST-${Date.now()}`;
	cy.get(prepareAppealSelector?._selectors?.appliationNumber).type(applicationNumber);
	cy.advanceToNextPage();
	
	cy.intercept('POST','/full-appeal/submit-appeal/list-of-documents').as('postRequest');
	cy.get(prepareAppealSelector?._selectors?.emailAddress).type('appellant2@planninginspectorate.gov.uk');
	cy.advanceToNextPage();	
	
	cy.get(prepareAppealSelector?._selectors?.emailCode).type('12345');
	cy.advanceToNextPage();

	cy.advanceToNextPage();

	cy.advanceToNextPage();
	cy.wait(2000);
	cy.location('search').then((search)=>{
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');
		applicationFormPage('full-planning','other',dynamicId);
		//Contact details
		applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant);
		
		contactDetailsPage.addContactDetailsData(context);
		
		//Site Details
		appealSiteAddressPage.addAppealSiteAddressData();		
		//What is the area of the appeal site?
		siteAreaPage.addSiteAreaData(planning,context?.applicationForm?.areaUnits,context);

		//Is the appeal site in a green belt?(Ans:Yes)
		greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);
	
		//Do you own all the land involved in the appeal?
		ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);
	
		if(!context?.applicationForm?.isOwnsAllLand){
			//Do you own some of the land involved in the appeal?
			ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand,context);
			//cy.advanceToNextPage();			
		}
		agriculturalHoldingPage.addAgriculturalHoldingData(context?.applicationForm?.isAgriculturalHolding,context);		
				
		inspectorNeedAccessPage.addInspectorNeedaccessData(context?.applicationForm?.isInspectorNeedAccess);		
		//Health and safety issues
		healthSafetyIssuesPage.addHealthSafetyIssuesData(context);
		//What is the application reference number?
		cy.get(prepareAppealSelector?._selectors?.applicationReference).invoke('val').then((inputValue)=>{
			expect(inputValue).to.equal(applicationNumber);
		});
		cy.advanceToNextPage();
		//What date did you submit your application?
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(currentDate.getDate() - 1);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(currentDate.getMonth() - 1);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(currentDate.getFullYear());
		cy.advanceToNextPage();
		//Enter the description of development that you submitted in your application
		cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type ('developmentDescriptionOriginal-hint123456789!£$%&*j');
		cy.advanceToNextPage();
		//Did the local planning authority change the description of development?
		//cy.get('#updateDevelopmentDescription').click();
		if(context?.applicationForm?.iaUpdateDevelopmentDescription){
			cy.get('[data-cy="answer-yes"]').click();
			cy.advanceToNextPage();
		} else{
			cy.get('[data-cy="answer-no"]').click();
			cy.advanceToNextPage();
		}
				
		//How would you prefer us to decide your appeal?		
		decideAppealsPage.addDecideAppealsData(context?.applicationForm?.appellantProcedurePreference);
		otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals,context);
		
		cy.uploadDocuments('full-planning','upload-application-form',dynamicId);
		uploadApplicationFormPage.addUploadApplicationFormData(context,dynamicId);

		submitPlanningObligationPage.addSubmitPlanningObligationData(context);

		separateOwnershipCertificatePage.addSeparateOwnershipCertificateData(context);
		
		if(context?.applicationForm?.appellantProcedurePreference !== 'written'){
			//Upload your draft statement of common ground
			cy.uploadFileFromFixtureDirectory('draft-statement-of-common-ground.pdf');
			cy.advanceToNextPage();
		}
		
		applyAppealCostsPage.addApplyAppealCostsData(context);
		submitDesignAccessStatementPage.addSubmitDesignAccessStatementData(context);
		newPlansDrawingsPage.addNewPlansDrawingsData(context);
		otherNewDocumentsPage.addOtherNewDocumentsData(context);		

		//submit
		cy.get(`a[href*="/appeals/full-planning/submit/declaration?id=${dynamicId}"]`).click();
		cy.wait(2000);
		//Cypress.Commands.add('advanceToNextPage', (text = 'Continue') => {
		cy.get('.govuk-button').contains('Accept and submit').click();

		cy.get('.govuk-panel__title').invoke('text').should((text)=>{
			expect(text.trim()).to.equal('Appeal submitted');
		});				
	});
};
