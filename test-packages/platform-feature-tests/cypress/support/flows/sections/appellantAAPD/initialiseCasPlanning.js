// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { DateService } from "../../../../utils/dateService";
import { appealIdWaitingForReview } from "./../appealIdWaitingForReview";
import { ipCommentsForAppealRef } from "./../ipComments/ipComments";
import { householderQuestionnaire } from "./../lpaManageAppeals/houseHolderQuestionnaire";
import { statementForCaseRef } from "./../lpaManageAppeals/statement";
import { viewValidatedAppealDetailsLPA } from "./../lpaManageAppeals/viewValidatedAppealDetailsLPA";
import { appealsApiClient} from "./../../../../support/appealsApiClient";
import { appealsE2EIntegration } from "../appealsE2EIntegration";
const applicationFormPage = require("../../pages/appellant-aapd/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../../pages/appellant-aapd/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../../pages/appellant-aapd/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../../pages/appellant-aapd/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../../pages/appellant-aapd/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../../pages/appellant-aapd/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownSomeLandPage");
const { InspectorNeedAccessPage } = require("../../pages/appellant-aapd/prepare-appeal/inspectorNeedaccessPage");
const { OtherAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../../pages/appellant-aapd/upload-documents/uploadApplicationFormPage");
const { ApplyAppealCostsPage } = require("../../pages/appellant-aapd/upload-documents/applyAppealCostsPage");
const { HealthSafetyIssuesPage } = require("../../pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { PrepareAppealSelector } = require("../../../../page-objects/prepare-appeal/prepare-appeal-selector");
const { SubmitDesignAccessStatementPage } = require("../../pages/appellant-aapd/upload-documents/submitDesignAccessStatementPage");

module.exports = (planning, grantedOrRefusedId, applicationType, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases = [], statementTestCases = []) => {
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
	const submitDesignAccessStatementPage = new SubmitDesignAccessStatementPage();
	const date = new DateService();

	cy.getByData(grantedOrRefusedId).click();
	cy.advanceToNextPage();

	if (grantedOrRefusedId === basePage._selectors?.answerNodecisionreceived) {
		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.beforeYouStart}/date-decision-due`);
	}
	else {
		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.beforeYouStart}/decision-date`);
	}

	cy.get(prepareAppealSelector?._casPlanningSelectors?.decisionDateDay).type(date.today());
	cy.get(prepareAppealSelector?._casPlanningSelectors?.decisionDateMonth).type(date.currentMonth());
	cy.get(prepareAppealSelector?._casPlanningSelectors?.decisionDateYear).type(date.currentYear());
	cy.advanceToNextPage();

	// cy.getByData(basePage?._selectors.answerNo).click();
	// cy.advanceToNextPage();

	cy.getByData(basePage?._selectors.applicationType).should('have.text', prepareAppealSelector?._selectors?.casPlanningText);
	cy.advanceToNextPage(prepareAppealData?.button);

	cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.casplanning}/email-address`);
	console.log('Prepare Appeal Data', prepareAppealData);
	cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.casplanning}/enter-code`);
	cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.casplanning}/email-address-confirmed`);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningAppealForm}/before-you-start`);
	cy.advanceToNextPage();
	cy.location('search').then((search) => {
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningAppealForm}/your-appeal`);
		applicationFormPage(prepareAppealSelector?._selectors?.casPlanningApplicationType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/application-name`);
		//Contact details
		applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant, prepareAppealData);


		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/contact-details`);
		contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.casPlanningApplicationType, prepareAppealData);

		//Site Details		
		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/appeal-site-address`);
		appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);

		//What is the area of the appeal site?

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/site-area`);
		siteAreaPage.addSiteAreaData(planning, context?.applicationForm?.areaUnits, context, prepareAppealData);

		//Is the appeal site in a green belt?(Ans:Yes)

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/green-belt`);
		greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

		//Do you own all the land involved in the appeal?

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/own-all-land`);
		ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);

		if (!context?.applicationForm?.isOwnsAllLand) {
			//Do you own some of the land involved in the appeal?

			cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/own-some-land`);
			ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);
		}
		//Will an inspector need to access your land or property?		

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/inspector-need-access`);
		inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);

		//Health and safety issues

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/health-safety-issues`);
		healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);

		//What is the application reference number?

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/reference-number`);
		const applicationNumber = `TEST-${Date.now()}`;	
		cy.get(prepareAppealSelector?._selectors?.applicationReference).type(applicationNumber);
		cy.advanceToNextPage();
		//What date did you submit your application?

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/application-date`);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(date.today());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(date.currentMonth());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(date.currentYear());
		cy.advanceToNextPage();
		//Enter the description of development that you submitted in your application

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/enter-description-of-development`);
		cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
		cy.advanceToNextPage();
		//Did the local planning authority change the description of development?

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/description-development-correct`);
		if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
			cy.getByData(basePage?._selectors.answerYes).click();
			cy.advanceToNextPage();
		} else {
			cy.getByData(basePage?._selectors.answerNo).click();
			cy.advanceToNextPage();
		}

		cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningPrepareAppeal}/other-appeals`);
		otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

		cy.uploadDocuments(prepareAppealSelector?._selectors?.casPlanningApplicationType , prepareAppealSelector?._selectors?.uploadApplicationForm, dynamicId);
		uploadApplicationFormPage.addUploadApplicationFormData(context);
		
		
		if (context?.statusOfOriginalApplication !== 'no decision') {
		//Upload your appeal statement		
			cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningUploadDocuments}/upload-appeal-statement`);
		}
		else {
			cy.validateURL(`${prepareAppealSelector?._casPlanningURLs?.appealsCasplanningUploadDocuments}/upload-decision-letter`);
	        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlanningApplConfirmLetter);
        	cy.advanceToNextPage();
		}

		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
		cy.advanceToNextPage();
		//Do you need to apply for an award of appeal costs?
		applyAppealCostsPage.addApplyAppealCostsData(context);
		//Submit design and access statement
		submitDesignAccessStatementPage.addSubmitDesignAccessStatementData(context);

		//submit
		cy.get(`a[href*="/appeals/cas-planning/submit/declaration?id=${dynamicId}"]`).click();

		cy.containsMessage(basePage?._selectors.govukButton, prepareAppealData?.acceptAndSubmitButton).click();

		cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should((text) => {
			expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
		});
	});
	if (context?.endToEndIntegration){
		appealsE2EIntegration(context, applicationType, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
	}	
};