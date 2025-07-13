// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { DateService } from "../../../../utils/dateService";
const applicationFormPage = require("../../pages/appellant-aapd/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../../pages/appellant-aapd/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../../pages/appellant-aapd/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../../pages/appellant-aapd/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../../pages/appellant-aapd/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../../pages/appellant-aapd/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownSomeLandPage");
const { AgriculturalHoldingPage } = require("../../pages/appellant-aapd/prepare-appeal/agriculturalHoldingPage");
const { InspectorNeedAccessPage } = require("../../pages/appellant-aapd/prepare-appeal/inspectorNeedaccessPage");
const { DecideAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/decideAppealsPage");
const { OtherAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../../pages/appellant-aapd/upload-documents/uploadApplicationFormPage");
const { SubmitPlanningObligationPage } = require("../../pages/appellant-aapd/upload-documents/submitPlanningObligationPage");
const { SeparateOwnershipCertificatePage } = require("../../pages/appellant-aapd/upload-documents/separateOwnershipCertificatePage");
const { ApplyAppealCostsPage } = require("../../pages/appellant-aapd/upload-documents/applyAppealCostsPage");
const { SubmitDesignAccessStatementPage } = require("../../pages/appellant-aapd/upload-documents/submitDesignAccessStatementPage");
const { NewPlansDrawingsPage } = require("../../pages/appellant-aapd/upload-documents/newPlansDrawingsPage");
const { OtherNewDocumentsPage } = require("../../pages/appellant-aapd/upload-documents/otherNewDocumentsPage");
const { HealthSafetyIssuesPage } = require("../../pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { MajorMinorDevelopmentPage } = require("../../pages/appellant-aapd/prepare-appeal/majorMinorDevelopmentPage");
const { ApplicationAboutPage } = require("../../pages/appellant-aapd/prepare-appeal/applicationAboutPage");

const { PrepareAppealSelector } = require("../../../../page-objects/prepare-appeal/prepare-appeal-selector");

module.exports = (planning, grantedOrRefusedId, applicationType, context, prepareAppealData) => {
	const basePage = new BasePage();
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
	const majorMinorDevelopmentPage =  new MajorMinorDevelopmentPage();
	const applicationAboutPage =  new ApplicationAboutPage();	
	const decideAppealsPage = new DecideAppealsPage();
	const otherAppealsPage = new OtherAppealsPage();
	const uploadApplicationFormPage = new UploadApplicationFormPage();
	const submitPlanningObligationPage = new SubmitPlanningObligationPage();
	const separateOwnershipCertificatePage = new SeparateOwnershipCertificatePage();
	const applyAppealCostsPage = new ApplyAppealCostsPage();
	const submitDesignAccessStatementPage = new SubmitDesignAccessStatementPage();
	const newPlansDrawingsPage = new NewPlansDrawingsPage();
	const otherNewDocumentsPage = new OtherNewDocumentsPage();
	const date = new DateService();

	cy.getByData(grantedOrRefusedId).click();
	cy.advanceToNextPage();
	if(grantedOrRefusedId ===  basePage._selectors?.answerNodecisionreceived){
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.beforeYouStart}/date-decision-due`);
	} 
	else {
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.beforeYouStart}/decision-date`);
	}		

	
	cy.get(prepareAppealSelector?._fullAppealselectors?.decisionDateDay).type(date.today());
	cy.get(prepareAppealSelector?._fullAppealselectors?.decisionDateMonth).type(date.currentMonth());
	cy.get(prepareAppealSelector?._fullAppealselectors?.decisionDateYear).type(date.currentYear());
	cy.advanceToNextPage();

	cy.getByData(basePage?._selectors.applicationType).should('have.text', applicationType);

	cy.advanceToNextPage(prepareAppealData?.button);

	// cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.fullAppealSubmit}/planning-application-number`);
	// const applicationNumber = `TEST-${Date.now()}`;
	// cy.getByData(prepareAppealSelector?._selectors?.applicationNumber).type(applicationNumber);
	// cy.advanceToNextPage();
	
	cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.fullAppealSubmit}/email-address`);
	cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.fullAppealSubmit}/enter-code`);
	cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.fullAppealSubmit}/email-address-confirmed`);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningAppealForm}/before-you-start`);
	cy.advanceToNextPage();
	
	cy.location('search').then((search) => {
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');

		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningAppealForm}/your-appeal`);
		applicationFormPage(prepareAppealSelector?._selectors?.fullPlanningApplicaitonType,prepareAppealSelector?._selectors?.appellantOther, dynamicId);
		//Contact details
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/application-name`);
		applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant,prepareAppealData);

		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/contact-details`);
		contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.fullPlanningApplicaitonType,prepareAppealData);

		//Site Details
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/appeal-site-address`);
		appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);
		//What is the area of the appeal site?
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/site-area`);
		siteAreaPage.addSiteAreaData(planning, context?.applicationForm?.areaUnits, context, prepareAppealData);

		//Is the appeal site in a green belt?(Ans:Yes)
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/green-belt`);
		greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

		//Do you own all the land involved in the appeal?
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/own-all-land`);
		ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);

		if (!context?.applicationForm?.isOwnsAllLand) {
			//Do you own some of the land involved in the appeal?
			cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/own-some-land`);
			ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);
			//cy.advanceToNextPage();			
		}
		agriculturalHoldingPage.addAgriculturalHoldingData(context?.applicationForm?.isAgriculturalHolding, context);

		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/inspector-need-access`);
		inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);
		//Health and safety issues
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/health-safety-issues`);
		healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);
		//What is the application reference number?
		const applicationNumber = `TEST-${Date.now()}`;
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/reference-number`);
		cy.get(prepareAppealSelector?._selectors?.applicationReference).type(applicationNumber);
		// cy.get(prepareAppealSelector?._selectors?.applicationReference).invoke('val').then((inputValue) => {
		// 	expect(inputValue).to.equal(applicationNumber);
		// });
		
		cy.advanceToNextPage();
		//What date did you submit your application?
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/application-date`);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(date.today());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(date.currentMonth());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(date.currentYear());
		cy.advanceToNextPage();
		//Was your application for a major or minor development?
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/major-minor-development`);
		majorMinorDevelopmentPage.addMajorMionorDevelopmentData(context?.applicationForm?.majorMionorDevelopmentData);
		cy.advanceToNextPage();

		//Was your application about any of the following?
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/application-about`);
		applicationAboutPage.addApplicationAboutData(context?.applicationForm?.applicationAboutData);
		cy.advanceToNextPage();

		//Enter the description of development that you submitted in your application
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/enter-description-of-development`);
		cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
		cy.advanceToNextPage();

		//Did the local planning authority change the description of development?
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/description-development-correct`)
		if (context?.applicationForm?.iaUpdateDevelopmentDescription) {			
			cy.getByData(basePage?._selectors.answerYes).click();
			cy.advanceToNextPage();
		} else {
			cy.getByData(basePage?._selectors.answerNo).click();
			cy.advanceToNextPage();
		}

		//How would you prefer us to decide your appeal?		
		decideAppealsPage.addDecideAppealsData(context?.applicationForm?.appellantProcedurePreference);
		cy.validateURL(`${prepareAppealSelector?._fullAppealURLs?.appealsFullPlanningPrepareAppeal}/other-appeals`);
		otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);
		
		cy.uploadDocuments(prepareAppealSelector?._selectors?.fullPlanningApplicaitonType, prepareAppealSelector?._selectors?.uploadApplicationForm, dynamicId);
		uploadApplicationFormPage.addUploadApplicationFormData(context);

		submitPlanningObligationPage.addSubmitPlanningObligationData(context);

		separateOwnershipCertificatePage.addSeparateOwnershipCertificateData(context);

		if (context?.applicationForm?.appellantProcedurePreference !== prepareAppealSelector?._selectors?.statusOfOriginalApplicationWritten) {
			//Upload your draft statement of common ground			
			cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDraftStatementOfCommonGround);
			cy.advanceToNextPage();
		}

		applyAppealCostsPage.addApplyAppealCostsData(context);
		submitDesignAccessStatementPage.addSubmitDesignAccessStatementData(context);
		newPlansDrawingsPage.addNewPlansDrawingsData(context);
		otherNewDocumentsPage.addOtherNewDocumentsData(context);

		//submit
		cy.get(`a[href*="/appeals/full-planning/submit/declaration?id=${dynamicId}"]`).click();

		cy.containsMessage(basePage?._selectors.govukButton,prepareAppealData?.acceptAndSubmitButton).click();

		cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should((text) => {
			expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
		});
	});
};
