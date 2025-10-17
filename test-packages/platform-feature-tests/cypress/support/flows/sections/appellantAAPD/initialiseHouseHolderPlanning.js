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
const { InspectorNeedAccessPage } = require("../../pages/appellant-aapd/prepare-appeal/inspectorNeedAccessPage");
const { OtherAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../../pages/appellant-aapd/upload-documents/uploadApplicationFormPage");
const { ApplyAppealCostsPage } = require("../../pages/appellant-aapd/upload-documents/applyAppealCostsPage");
const { HealthSafetyIssuesPage } = require("../../pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { PrepareAppealSelector } = require("../../../../page-objects/prepare-appeal/prepare-appeal-selector");

module.exports = (planning, grantedOrRefusedId, context, prepareAppealData) => {
	const basePage = new BasePage();
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
	const date = new DateService();

	cy.getByData(grantedOrRefusedId).click();
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.beforeYouStart}/decision-date-householder`);

	cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(date.today());
	cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.currentMonth());
	cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(date.currentYear());
	cy.advanceToNextPage();

	// cy.getByData(basePage?._selectors.answerNo).click();
	// cy.advanceToNextPage();

	cy.getByData(basePage?._selectors.applicationType).should('have.text', prepareAppealSelector?._selectors?.householderPlanningText);

	cy.advanceToNextPage(prepareAppealData?.button);

	cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealHouseholderDecison}/email-address`);
	console.log('Prepare Appeal Data', prepareAppealData);
	cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealHouseholderDecison}/enter-code`);
	cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealHouseholderDecison}/email-address-confirmed`);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderAppealForm}/before-you-start`);
	cy.advanceToNextPage();
	cy.location('search').then((search) => {
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderAppealForm}/your-appeal`);
		applicationFormPage(prepareAppealSelector?._selectors?.houseHolderApplicaitonType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/application-name`);
		//Contact details
		applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant, prepareAppealData);


		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/contact-details`);
		contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.houseHolderApplicaitonType, prepareAppealData);

		//Site Details		
		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/appeal-site-address`);
		appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);

		//What is the area of the appeal site?

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/site-area`);
		siteAreaPage.addSiteAreaData(planning, context?.applicationForm?.areaUnits, context, prepareAppealData);

		//Is the appeal site in a green belt?(Ans:Yes)

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/green-belt`);
		greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

		//Do you own all the land involved in the appeal?

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/own-all-land`);
		ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);

		if (!context?.applicationForm?.isOwnsAllLand) {
			//Do you own some of the land involved in the appeal?

			cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/own-some-land`);
			ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);
		}
		//Will an inspector need to access your land or property?		

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/inspector-need-access`);
		inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);

		//Health and safety issues

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/health-safety-issues`);
		healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);

		//What is the application reference number?

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/reference-number`);
		const applicationNumber = `TEST-${Date.now()}`;	
		cy.get(prepareAppealSelector?._selectors?.applicationReference).type(applicationNumber);
		cy.advanceToNextPage();
		//What date did you submit your application?

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/application-date`);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(date.today());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(date.currentMonth());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(date.currentYear());
		cy.advanceToNextPage();
		//Enter the description of development that you submitted in your application

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/enter-description-of-development`);
		cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
		cy.advanceToNextPage();
		//Did the local planning authority change the description of development?

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/description-development-correct`);
		if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
			cy.getByData(basePage?._selectors.answerYes).click();
			cy.advanceToNextPage();
		} else {
			cy.getByData(basePage?._selectors.answerNo).click();
			cy.advanceToNextPage();
		}

		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderPrepareAppeal}/other-appeals`);
		otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

		cy.uploadDocuments(prepareAppealSelector?._selectors?.houseHolderApplicaitonType, prepareAppealSelector?._selectors?.uploadApplicationForm, dynamicId);
		uploadApplicationFormPage.addUploadApplicationFormData(context);

		//Upload your appeal statement		
		cy.validateURL(`${prepareAppealSelector?._houseHolderURLs?.appealsHouseholderUploadDocuments}/upload-appeal-statement`);

		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
		cy.advanceToNextPage();
		//Do you need to apply for an award of appeal costs?
		applyAppealCostsPage.addApplyAppealCostsData(context);

		//submit
		cy.get(`a[href*="/appeals/householder/submit/declaration?id=${dynamicId}"]`).click();

		cy.containsMessage(basePage?._selectors.govukButton, prepareAppealData?.acceptAndSubmitButton).click();

		cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should((text) => {
			expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
		});
	});
};